'use client';
import { useState } from 'react';
import styles from './CategoryGrid.module.css';
import { getCategoryName, getCategoryEmoji } from '@/lib/utils/categoryUtils';

interface CategoryItem {
  id: number;
  text: string;
  emoji?: string;
  img?: string;
  isMore?: boolean;
}

export default function CategoryGrid() {
  const [showMore, setShowMore] = useState(false);

  // 카테고리 데이터 생성 (1-19번까지)
  const categoryData: CategoryItem[] = Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    text: getCategoryName(i + 1),
    emoji: getCategoryEmoji(i + 1),
  }));

  const shownCategories = showMore
    ? categoryData
    : categoryData
        .slice(0, 4)
        .concat([{ id: 0, img: '', text: '더보기', isMore: true }]);

  return (
    <div className={styles.categoryRow}>
      {shownCategories.map((cat: CategoryItem, i: number) =>
        cat.isMore ? (
          <div
            className={styles.category}
            key={i}
            onClick={() => setShowMore(!showMore)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.arrowOnly}>
              <svg
                width='40'
                height='40'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='20'
                  cy='20'
                  r='19'
                  stroke='#E5E5E5'
                  strokeWidth='2'
                  fill='#fff'
                />
                <path
                  d={showMore ? 'M12 22l8-8 8 8' : 'M12 18l8 8 8-8'}
                  stroke='#888'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className={styles.categoryText}>
              {showMore ? '접기' : '더보기'}
            </div>
          </div>
        ) : (
          <div className={styles.category} key={i}>
            <div className={styles.categoryIcon}>
              {/* <img
                src={cat.img}
                alt={cat.text}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              /> */}
              <div className={styles.iconPlaceholder}>
                {cat.emoji}
              </div>
            </div>
            <div className={styles.categoryText}>{cat.text}</div>
          </div>
        )
      )}
    </div>
  );
}
