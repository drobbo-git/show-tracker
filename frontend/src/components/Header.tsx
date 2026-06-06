import React from 'react';

interface HeaderProps {
  activeTab: 'seen' | 'wishlist';
  onTabChange: (tab: 'seen' | 'wishlist') => void;
  onAddClick: () => void;
}

export default function Header({ activeTab, onTabChange, onAddClick }: HeaderProps) {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.curtain}>🎭</span>
          <div>
            <h1 style={styles.title}>Broadway Tracker</h1>
            <p style={styles.subtitle}>Your personal theater diary</p>
          </div>
        </div>

        <button onClick={onAddClick} style={styles.addBtn}>
          + Add Show
        </button>
      </div>

      <nav style={styles.nav}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'seen' ? styles.tabActive : {}) }}
          onClick={() => onTabChange('seen')}
        >
          Shows Seen
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'wishlist' ? styles.tabActive : {}) }}
          onClick={() => onTabChange('wishlist')}
        >
          My Wishlist
        </button>
      </nav>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: 'linear-gradient(180deg, #1a0a0e 0%, #0f0f0f 100%)',
    borderBottom: '1px solid #9b1b30',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px rgba(155, 27, 48, 0.3)',
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  curtain: {
    fontSize: 36,
    lineHeight: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#c9a84c',
    letterSpacing: '0.03em',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 12,
    color: '#a89a80',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  addBtn: {
    background: '#9b1b30',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.02em',
    transition: 'background 0.2s',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  nav: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    gap: 4,
  },
  tab: {
    background: 'transparent',
    color: '#a89a80',
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 500,
    borderBottom: '3px solid transparent',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  },
  tabActive: {
    color: '#c9a84c',
    borderBottomColor: '#c9a84c',
    background: 'rgba(201, 168, 76, 0.05)',
  },
};
