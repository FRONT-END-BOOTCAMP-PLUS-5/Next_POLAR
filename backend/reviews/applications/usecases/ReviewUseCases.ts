import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { CreateReviewRequest } from '@/backend/reviews/applications/dtos/ReviewDtos';

export class ReviewUseCases {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  // nickname으로 받은 리뷰 리스트 조회
  async getReviewsByReceiverNickname(nickname: string): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByReceiverNickname(nickname);
  }

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  async getReviewsByWriterNickname(nickname: string): Promise<ReviewEntity[]> {
    return await this.reviewRepository.findByWriterNickname(nickname);
  }

  // 리뷰 생성 (writerNickname, receiverNickname 기반)
  async createReview(request: CreateReviewRequest): Promise<ReviewEntity> {
    // nickname 기반으로 repository에 전달
    return await this.reviewRepository.createByNicknames(request);
  }
}
