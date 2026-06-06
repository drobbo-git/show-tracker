import React from 'react';
import { Show } from '../types';

interface WishlistCardProps {
  show: Show;
  onDelete: (id: number) => void;
  onMarkSeen: (show: Show) => void;
}

export default function WishlistCard({ show, onDelete, onMarkSeen }: WishlistCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.titleBlock}>
          <div style={styles.wishBadge}>✦ Wishlist</div>
          <h3 style={styles.title}>{show.title}</h3>
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

      {show.notes && <p style={styles.notes}>{show.notes}</p>}

      <button onClick={() => onMarkSeen(show)} style={styles.seenBtn}>
        I saw this! →
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1a1510',
    border: '1px solid #3a2e1a',
    borderRadius: 10,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'border-color 0.2s',
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
  wishBadge: {
    fontSize: 11,
    color: '#c9a84c',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 600,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f0ebe0',
    lineHeight: 1.2,
  },
  deleteBtn: {
    background: 'transparent',
    color: '#555',
    fontSize: 14,
    padding: '2px 6px',
    borderRadius: 4,
    flexShrink: 0,
  },
  notes: {
    fontSize: 14,
    color: '#a89a80',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  seenBtn: {
    background: 'transparent',
    border: '1px solid #9b1b30',
    color: '#c9a84c',
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    alignSelf: 'flex-start',
    transition: 'background 0.2s',
  },
};
