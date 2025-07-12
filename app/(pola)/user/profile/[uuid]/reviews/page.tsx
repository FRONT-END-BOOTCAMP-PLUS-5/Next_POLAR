'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import styles from './UserReviews.module.css';

interface Review {
  id: number;
  helpId: number;
  writerId: number;
  receiverId: number;
  rating: number;
  text: string;
  createdAt: string;
}

export default function UserReviewsPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        // 임시로 UUID를 userId로 사용하여 API 호출
        const response = await fetch(`/api/reviews?userId=${uuid}`);
        
        if (!response.ok) {
          throw new Error('리뷰를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          throw new Error(data.error || '리뷰를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('리뷰 조회 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [uuid]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1>유저 리뷰 목록</h1>
        <p>UUID: {uuid}</p>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>유저 리뷰 목록</h1>
        <p>UUID: {uuid}</p>
        <p>오류: {error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>유저 리뷰 목록</h1>
      <p className={styles.uuid}>UUID: {uuid}</p>
      
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>받은 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>받은 리뷰 목록 ({reviews.length}개)</h2>
          <ul className={styles.reviewsList}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <a href={`/reviews/${review.id}`} className={styles.reviewLink}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewId}>리뷰 #{review.id}</span>
                    <span className={styles.rating}>{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className={styles.reviewText}>{review.text}</p>
                  <small className={styles.reviewDate}>작성일: {new Date(review.createdAt).toLocaleDateString()}</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={styles.buttonContainer}>
        <a href={`/user/profile/${uuid}`} className={styles.backButton}>프로필로 돌아가기</a>
      </div>
    </div>
  );
} 