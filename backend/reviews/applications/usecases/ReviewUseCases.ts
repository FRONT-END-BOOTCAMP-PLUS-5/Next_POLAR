import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';

export class ReviewUseCases {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  // 1. userId로 받은 리뷰 리스트 조회
  async getReviewsByReceiverId(userId: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByReceiverId(userId);
  }

  // 2. 리뷰 id로 단일 리뷰 상세 조회
  async getReviewById(reviewId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findById(reviewId);
  }

  // 3. 리뷰 생성
  async createReview(review: Omit<ReviewEntity, 'id' | 'createdAt'>): Promise<ReviewEntity> {
    return await this.reviewRepository.create(review);
  }
}
