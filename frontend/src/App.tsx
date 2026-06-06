import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Show, ShowFormData } from './types';
import Header from './components/Header';
import ShowCard from './components/ShowCard';
import WishlistCard from './components/WishlistCard';
import AddShowModal from './components/AddShowModal';

type SortOption = 'date' | 'rating' | 'added';

export default function App() {
  const [activeTab, setActiveTab] = useState<'seen' | 'wishlist'>('seen');
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('added');
  const [showModal, setShowModal] = useState(false);
  const [moveTarget, setMoveTarget] = useState<Show | null>(null);

  const fetchShows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = { status: activeTab };
      if (sortBy !== 'added') params.sort = sortBy;
      const res = await axios.get<Show[]>('/api/shows', { params });
      setShows(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Server error: ${err.response.data?.error ?? err.response.statusText}`);
      } else {
        setError('Could not reach the server. Make sure the backend is running on port 3001.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortBy]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const handleAdd = async (data: ShowFormData) => {
    await axios.post('/api/shows', {
      ...data,
      rating: data.rating === '' ? null : data.rating,
      date_seen: data.date_seen || null,
      venue: data.venue || null,
      notes: data.notes || null,
    });
    await fetchShows();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this show?')) return;
    await axios.delete(`/api/shows/${id}`);
    setShows((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMarkSeen = async (data: ShowFormData) => {
    if (!moveTarget) return;
    await axios.put(`/api/shows/${moveTarget.id}`, {
      ...data,
      status: 'seen',
      rating: data.rating === '' ? null : data.rating,
      date_seen: data.date_seen || null,
      venue: data.venue || null,
      notes: data.notes || null,
    });
    setMoveTarget(null);
    await fetchShows();
  };

  const seenCount = activeTab === 'seen' ? shows.length : null;
  const wishCount = activeTab === 'wishlist' ? shows.length : null;

  return (
    <div style={styles.app}>
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setSortBy('added'); }}
        onAddClick={() => setShowModal(true)}
      />

      <main style={styles.main}>
        <div style={styles.toolbar}>
          <p style={styles.count}>
            {loading ? '' : `${shows.length} ${activeTab === 'seen' ? 'show' : 'wish'}${shows.length !== 1 ? 's' : ''}`}
          </p>

          {activeTab === 'seen' && (
            <div style={styles.sortRow}>
              <span style={styles.sortLabel}>Sort by:</span>
              {(['added', 'date', 'rating'] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  style={{ ...styles.sortBtn, ...(sortBy === opt ? styles.sortBtnActive : {}) }}
                  onClick={() => setSortBy(opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div style={styles.center}>
            <p style={styles.muted}>Loading…</p>
          </div>
        )}

        {!loading && !error && shows.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>{activeTab === 'seen' ? '🎭' : '✨'}</p>
            <p style={styles.emptyTitle}>
              {activeTab === 'seen' ? 'No shows logged yet' : 'Your wishlist is empty'}
            </p>
            <p style={styles.emptyHint}>
              {activeTab === 'seen'
                ? 'Click "Add Show" to log a show you\'ve seen.'
                : 'Click "Add Show" to add shows you want to see.'}
            </p>
            <button style={styles.emptyBtn} onClick={() => setShowModal(true)}>
              + Add Show
            </button>
          </div>
        )}

        {!loading && shows.length > 0 && (
          <div style={styles.grid}>
            {activeTab === 'seen'
              ? shows.map((s) => (
                  <ShowCard key={s.id} show={s} onDelete={handleDelete} />
                ))
              : shows.map((s) => (
                  <WishlistCard
                    key={s.id}
                    show={s}
                    onDelete={handleDelete}
                    onMarkSeen={(show) => setMoveTarget(show)}
                  />
                ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddShowModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
          defaultTab={activeTab}
        />
      )}

      {moveTarget && (
        <AddShowModal
          title={`I saw "${moveTarget.title}"!`}
          onClose={() => setMoveTarget(null)}
          onSubmit={handleMarkSeen}
          defaultTab="seen"
          prefill={moveTarget}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    background: '#0f0f0f',
  },
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '24px 24px 64px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  count: {
    fontSize: 13,
    color: '#666',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  sortRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: 12,
    color: '#555',
    marginRight: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sortBtn: {
    background: 'transparent',
    border: '1px solid #2d2d2d',
    color: '#666',
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: 12,
    transition: 'all 0.2s',
  },
  sortBtnActive: {
    background: '#9b1b30',
    borderColor: '#9b1b30',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 16,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  muted: {
    color: '#555',
    fontSize: 14,
  },
  errorBox: {
    background: 'rgba(155, 27, 48, 0.1)',
    border: '1px solid rgba(155, 27, 48, 0.3)',
    borderRadius: 8,
    padding: '16px 20px',
    color: '#e07090',
    fontSize: 14,
    marginBottom: 20,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
    lineHeight: 1,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#888',
    fontFamily: 'Playfair Display, serif',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  emptyBtn: {
    background: '#9b1b30',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
  },
};
