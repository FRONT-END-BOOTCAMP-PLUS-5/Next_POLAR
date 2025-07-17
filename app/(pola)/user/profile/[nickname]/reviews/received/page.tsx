"use client";

import { useParams } from "next/navigation";
import styles from "@/app/(pola)/user/profile/[nickname]/reviews/UserReviews.module.css";
import ProfileSummary from "../_components/ProfileSummary";
import ReviewCard from "../_components/ReviewCard";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { useReceivedReviews } from "@/lib/hooks/useReceivedReviews";
import { useAuthStore } from "@/lib/stores/authStore";

const ReceivedReviewsPage: React.FC = () => {
  const params = useParams();
  // Zustand 전역 상태에서 현재 로그인한 유저 정보 가져오기
  const { user: currentUser, isAuthenticated } = useAuthStore();

  console.log(
    "로그인 유저:",
    currentUser?.nickname,
    "인증여부:",
    isAuthenticated
  );

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
  } = useUserProfile(params.nickname as string);
  const {
    data: receivedReviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsErrorData,
  } = useReceivedReviews(params.nickname as string);

  const isLoading = userLoading || reviewsLoading;
  const isError = userError || reviewsError;
  const error = userErrorData || reviewsErrorData;

  if (isLoading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (isError) {
    return (
      <div className={styles.errorContainer}>
        오류: {error?.message || "알 수 없는 오류가 발생했습니다."}
      </div>
    );
  }

  const reviews = receivedReviewsData?.reviews || [];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>받은리뷰</h2>
      {user && <ProfileSummary user={user} />}
      <div className={styles.reviewCountRow}>
        <span className={styles.reviewCount}>리뷰 {reviews.length}개</span>
      </div>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>받은 리뷰가 없습니다.</div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceivedReviewsPage;
