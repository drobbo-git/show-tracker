import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, sort } = req.query;
    let query = 'SELECT * FROM shows';
    const params: string[] = [];

    if (status) {
      params.push(status as string);
      query += ` WHERE status = $${params.length}`;
    }

    if (sort === 'rating') {
      query += ' ORDER BY rating DESC NULLS LAST';
    } else if (sort === 'date') {
      query += ' ORDER BY date_seen DESC NULLS LAST';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('[GET /api/shows]', err);
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, venue, date_seen, rating, notes, status } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO shows (title, venue, date_seen, rating, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, venue || null, date_seen || null, rating || null, notes || null, status || 'wishlist']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[POST /api/shows]', err);
    res.status(500).json({ error: 'Failed to create show' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, venue, date_seen, rating, notes, status } = req.body;

    const result = await pool.query(
      `UPDATE shows
       SET title = COALESCE($1, title),
           venue = COALESCE($2, venue),
           date_seen = COALESCE($3, date_seen),
           rating = COALESCE($4, rating),
           notes = COALESCE($5, notes),
           status = COALESCE($6, status)
       WHERE id = $7
       RETURNING *`,
      [title, venue, date_seen, rating, notes, status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update show' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    res.json({ message: 'Show deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete show' });
  }
});

export default router;
