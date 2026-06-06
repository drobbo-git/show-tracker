import React from 'react';
import { Show } from '../types';
import StarRating from './StarRating';

interface ShowCardProps {
  show: Show;
  onDelete: (id: number) => void;
}

export default function ShowCard({ show, onDelete }: ShowCardProps) {
  const formattedDate = show.date_seen
    ? new Date(show.date_seen + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.titleBlock}>
          <h3 style={styles.title}>{show.title}</h3>
          {show.venue && <p style={styles.venue}>{show.venue}</p>}
        </div>
        <button
          onClick={() => onDelete(show.id)}
          style={styles.deleteBtn}
          title="Delete show"
          aria-label="Delete show"
        >
          ✕
        </button>
      </div>

      <div style={styles.meta}>
        {show.rating !== null && (
          <div style={styles.metaItem}>
            <StarRating rating={show.rating} />
          </div>
        )}
        {formattedDate && (
          <span style={styles.date}>{formattedDate}</span>
        )}
      </div>

      {show.notes && <p style={styles.notes}>{show.notes}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1e1e1e',
    border: '1px solid #2d2d2d',
    borderRadius: 10,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f0ebe0',
    lineHeight: 1.2,
  },
  venue: {
    fontSize: 13,
    color: '#c9a84c',
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteBtn: {
    background: 'transparent',
    color: '#555',
    fontSize: 14,
    padding: '2px 6px',
    borderRadius: 4,
    flexShrink: 0,
    transition: 'color 0.2s',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  notes: {
    fontSize: 14,
    color: '#a89a80',
    lineHeight: 1.6,
    fontStyle: 'italic',
    borderTop: '1px solid #2d2d2d',
    paddingTop: 12,
  },
};
