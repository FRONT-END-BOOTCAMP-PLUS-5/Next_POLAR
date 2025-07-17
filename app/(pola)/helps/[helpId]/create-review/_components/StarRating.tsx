import React from 'react';
import styles from './StarRating.module.css';

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating = ({ value, max = 5, onChange, readOnly = false, size = 24 }: StarRatingProps) => {
  return (
    <div className={styles.starRating}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={
            i < value
              ? styles.starFilled
              : styles.starEmpty
          }
          style={{ fontSize: size }}
          onClick={() => !readOnly && onChange && onChange(i + 1)}
        >
          {i < value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating; 