"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/app/(pola)/user/profile/[nickname]/reviews/UserReviews.module.css";
import ReviewCard from "@/app/_components/commons/list-card/review-list-card/ReviewCard";
import { useReceivedReviews } from "@/lib/hooks/useReceivedReviews";
import { useWrittenReviews } from "@/lib/hooks/useWrittenReviews";

const PAGE_SIZE = 10;

const ReviewListPage: React.FC = () => {
  const params = useParams();
  const nickname = params.nickname as string;
  const [tab, setTab] = useState<"received" | "written">("received");
  const [page, setPage] = useState(1);

  // 받은 리뷰
  const {
    data: receivedReviewsData,
    isLoading: receivedLoading,
    isError: receivedError,
    error: receivedErrorData,
  } = useReceivedReviews(nickname);

  // 쓴 리뷰
  const {
    data: writtenReviewsData,
    isLoading: writtenLoading,
    isError: writtenError,
    error: writtenErrorData,
  } = useWrittenReviews(nickname);

  // 탭별 데이터
  const reviews =
    tab === "received"
      ? receivedReviewsData?.reviews || []
      : writtenReviewsData?.reviews || [];
  const isLoading = tab === "received" ? receivedLoading : writtenLoading;
  const isError = tab === "received" ? receivedError : writtenError;
  const error = tab === "received" ? receivedErrorData : writtenErrorData;

  // 페이지네이션
  const total = reviews.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (nextTab: "received" | "written") => {
    setTab(nextTab);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabRow}>
        <button
          className={`${styles.tabBtn} ${
            tab === "received" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("received")}
        >
          받은 리뷰
        </button>
        <button
          className={`${styles.tabBtn} ${
            tab === "written" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("written")}
        >
          쓴 리뷰
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>로딩 중...</div>
      ) : isError ? (
        <div className={styles.errorContainer}>
          오류: {error?.message || "알 수 없는 오류가 발생했습니다."}
        </div>
      ) : (
        <>
          <div className={styles.reviewCountRow}>
            <span className={styles.reviewCount}>리뷰 {total}개</span>
          </div>
          {pagedReviews.length === 0 ? (
            <div className={styles.emptyState}>
              {tab === "received"
                ? "받은 리뷰가 없습니다."
                : "작성한 리뷰가 없습니다."}
            </div>
          ) : (
            <ul className={styles.reviewsList}>
              {pagedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </ul>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </button>
              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewListPage;
