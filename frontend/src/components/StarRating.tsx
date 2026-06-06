import React from 'react';

interface StarRatingProps {
  rating: number | null;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, interactive = false, onChange, size = 18 }: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const display = hovered ?? rating ?? 0;

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          style={{
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= display ? '#c9a84c' : '#333',
            transition: 'color 0.15s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
