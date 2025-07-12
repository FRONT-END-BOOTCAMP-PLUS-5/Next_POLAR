import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export interface IReviewRepository {
  // userId로 받은 리뷰 리스트 조회
  findByReceiverId(userId: number): Promise<ReviewEntity[]>;

  // 리뷰 id로 단일 리뷰 상세 조회
  findById(reviewId: number): Promise<ReviewEntity | null>;

  // 리뷰 생성
  create(review: Omit<ReviewEntity, 'id' | 'createdAt'>): Promise<ReviewEntity>;
} 