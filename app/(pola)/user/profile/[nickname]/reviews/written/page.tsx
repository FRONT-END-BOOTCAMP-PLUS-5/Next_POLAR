'use client';

import { use } from 'react';
import styles from '@/app/(pola)/user/profile/[nickname]/reviews/UserReviews.module.css';
import ProfileSummary from '../_components/ProfileSummary';
import ReviewCard from '../_components/ReviewCard';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useWrittenReviews } from '@/lib/hooks/useWrittenReviews';

export default function WrittenReviewsPage({ params }: { params: Promise<{ nickname: string }> }) {
  const { nickname } = use(params);
  const { data: user, isLoading: userLoading, isError: userError, error: userErrorData } = useUserProfile(nickname);
  const { data: writtenReviewsData, isLoading: reviewsLoading, isError: reviewsError, error: reviewsErrorData } = useWrittenReviews(nickname);

  const isLoading = userLoading || reviewsLoading;
  const isError = userError || reviewsError;
  const error = userErrorData || reviewsErrorData;

  if (isLoading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (isError) {
    return <div className={styles.errorContainer}>오류: {error?.message || '알 수 없는 오류가 발생했습니다.'}</div>;
  }

  const reviews = writtenReviewsData?.reviews || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>쓴리뷰</h2>
      {user && <ProfileSummary user={user} />}
      <div className={styles.reviewCountRow}>
        <span className={styles.reviewCount}>리뷰 {reviews.length}개</span>
      </div>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>작성한 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      )}
    </div>
  );
} 