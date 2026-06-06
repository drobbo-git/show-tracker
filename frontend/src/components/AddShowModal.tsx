import React, { useState, useEffect } from 'react';
import { ShowFormData, Show } from '../types';
import StarRating from './StarRating';

interface AddShowModalProps {
  onClose: () => void;
  onSubmit: (data: ShowFormData) => Promise<void>;
  defaultTab?: 'seen' | 'wishlist';
  prefill?: Show;
  title?: string;
}

const empty: ShowFormData = {
  title: '',
  venue: '',
  date_seen: '',
  rating: '',
  notes: '',
  status: 'seen',
};

export default function AddShowModal({ onClose, onSubmit, defaultTab = 'seen', prefill, title: modalTitle }: AddShowModalProps) {
  const [form, setForm] = useState<ShowFormData>({
    ...empty,
    status: defaultTab,
    title: prefill?.title ?? '',
    notes: prefill?.notes ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (field: keyof ShowFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSeen = form.status === 'seen';

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} role="dialog" aria-modal="true">
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{modalTitle ?? 'Add a Show'}</h2>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>

        {!prefill && (
          <div style={styles.tabRow}>
            <button
              type="button"
              style={{ ...styles.typeTab, ...(isSeen ? styles.typeTabActive : {}) }}
              onClick={() => set('status', 'seen')}
            >
              I've Seen It
            </button>
            <button
              type="button"
              style={{ ...styles.typeTab, ...(!isSeen ? styles.typeTabActiveWish : {}) }}
              onClick={() => set('status', 'wishlist')}
            >
              Add to Wishlist
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Show Title *
            <input
              style={styles.input}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Hamilton, Wicked, The Lion King"
              autoFocus
            />
          </label>

          {isSeen && (
            <>
              <label style={styles.label}>
                Venue / Theater
                <input
                  style={styles.input}
                  value={form.venue}
                  onChange={(e) => set('venue', e.target.value)}
                  placeholder="e.g. Richard Rodgers Theatre"
                />
              </label>

              <label style={styles.label}>
                Date Seen
                <input
                  style={styles.input}
                  type="date"
                  value={form.date_seen}
                  onChange={(e) => set('date_seen', e.target.value)}
                />
              </label>

              <div style={styles.label as React.CSSProperties}>
                My Rating
                <div style={{ marginTop: 8 }}>
                  <StarRating
                    rating={form.rating === '' ? null : form.rating}
                    interactive
                    onChange={(r) => set('rating', r)}
                    size={28}
                  />
                </div>
              </div>
            </>
          )}

          <label style={styles.label}>
            Notes
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder={isSeen ? 'What did you think? Favorite moments?' : 'Why do you want to see it?'}
              rows={3}
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving…' : isSeen ? 'Save Show' : 'Add to Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 12,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #2d2d2d',
  },
  modalTitle: {
    fontSize: 20,
    color: '#c9a84c',
    fontWeight: 700,
  },
  closeBtn: {
    background: 'transparent',
    color: '#666',
    fontSize: 18,
    padding: '4px 8px',
  },
  tabRow: {
    display: 'flex',
    borderBottom: '1px solid #2d2d2d',
  },
  typeTab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    color: '#666',
    fontSize: 14,
    fontWeight: 500,
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  typeTabActive: {
    color: '#9b1b30',
    borderBottomColor: '#9b1b30',
    background: 'rgba(155, 27, 48, 0.05)',
  },
  typeTabActiveWish: {
    color: '#c9a84c',
    borderBottomColor: '#c9a84c',
    background: 'rgba(201, 168, 76, 0.05)',
  },
  form: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: '#a89a80',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  input: {
    background: '#242424',
    border: '1px solid #333',
    borderRadius: 6,
    color: '#f0ebe0',
    fontSize: 15,
    padding: '10px 12px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 80,
  },
  error: {
    color: '#e05577',
    fontSize: 13,
    padding: '8px 12px',
    background: 'rgba(224, 85, 119, 0.1)',
    borderRadius: 6,
    border: '1px solid rgba(224, 85, 119, 0.2)',
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '10px 20px',
    borderRadius: 6,
    fontSize: 14,
  },
  submitBtn: {
    background: '#9b1b30',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
  },
};
