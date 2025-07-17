import React from 'react';

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating = ({ value, max = 5, onChange, readOnly = false, size = 24 }: StarRatingProps) => {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < value ? '#FFD600' : '#E0E0E0',
            cursor: readOnly ? 'default' : 'pointer',
            userSelect: 'none',
          }}
          onClick={() => !readOnly && onChange && onChange(i + 1)}
        >
          {i < value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating; 