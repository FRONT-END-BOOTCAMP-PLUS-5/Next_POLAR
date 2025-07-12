'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from './ReviewDetail.module.css';

interface Review {
  id: number;
  helpId: number;
  writerId: number;
  receiverId: number;
  rating: number;
  text: string;
  createdAt: string;
}

interface UserProfile {
  id: number;
  name: string;
  profileImgUrl?: string;
}

export default function ReviewDetailPage({ 
  params 
}: { 
  params: Promise<{ reviewId: string }> 
}) {
  const { reviewId } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [writer, setWriter] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // 1. 리뷰 정보 조회
        const reviewRes = await fetch(`/api/reviews/${reviewId}`);
        if (!reviewRes.ok) throw new Error('리뷰를 불러오는데 실패했습니다.');
        const reviewData = await reviewRes.json();
        if (!reviewData.success) throw new Error(reviewData.error || '리뷰를 불러오는데 실패했습니다.');
        setReview(reviewData.review);

        // 2. 작성자 프로필 정보 조회
        const writerId = reviewData.review.writerId;
        const userRes = await fetch(`/api/users/${Number(writerId)}`);
        if (userRes.status !== 200) throw new Error('작성자 정보를 불러오는데 실패했습니다.');
        const userData = await userRes.json();
        if (!userData.id || !userData.name) throw new Error('작성자 정보가 올바르지 않습니다.');
        setWriter({
          id: userData.id,
          name: userData.name,
          profileImgUrl: userData.profileImgUrl,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reviewId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>오류: {error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  if (!review || !writer) {
    return (
      <div className={styles.errorContainer}>
        <h1>리뷰 상세보기</h1>
        <p>리뷰 ID: {reviewId}</p>
        <p>리뷰 또는 작성자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 상단 프로필 */}
      <div className={styles.profileSection}>
        <Image
          src={writer.profileImgUrl ? writer.profileImgUrl : '/default-profile.png'}
          alt="프로필"
          width={64}
          height={64}
          className={styles.profileImage}
        />
        <div>
          <div className={styles.writerName}>{writer.name}</div>
        </div>
      </div>
      {/* 별점 */}
      <div className={styles.starRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
      {/* 리뷰 텍스트 */}
      <div className={styles.reviewText}>{review.text}</div>
      {/* 도움 요청 정보 */}
      <div className={styles.helpId}>도움 요청 ID: #{review.helpId}</div>
      {/* 하고싶은 말(코멘트) - 예시 */}
      <div className={styles.commentSection}>
        <div className={styles.commentTitle}>하고싶은 말</div>
        <div className={styles.commentBox}>
          {review.text}
        </div>
      </div>
      {/* 뒤로가기 버튼 */}
      <div className={styles.buttonContainer}>
        <button 
          className={styles.backButton}
          onClick={() => window.history.back()}>
          뒤로가기
        </button>
      </div>
    </div>
  );
} 