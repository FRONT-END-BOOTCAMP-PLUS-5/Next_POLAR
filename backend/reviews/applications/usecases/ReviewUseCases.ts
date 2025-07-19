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
    // 리뷰 상대방 nickname 조회
    const receiverNickname = await this.getReviewReceiverNickname(request.writerNickname, request.helpId);
    
    // receiverNickname을 포함한 요청 객체 생성
    const reviewRequest = {
      ...request,
      receiverNickname
    };
    
    // nickname 기반으로 repository에 전달
    return await this.reviewRepository.createByNicknames(reviewRequest);
  }

  // 리뷰 생성 권한 여부 확인
  async checkCreateReviewAccess(nickname: string, helpId: number): Promise<boolean> {
    try {
      // 리뷰 상대방 nickname 조회 시도
      await this.getReviewReceiverNickname(nickname, helpId);
      return true; // 상대방을 찾을 수 있으면 권한 있음
    } catch (error) {
      return false; // 상대방을 찾을 수 없으면 권한 없음
    }
  }

  // 리뷰 상대방 nickname 조회
  async getReviewReceiverNickname(writerNickname: string, helpId: number): Promise<string> {
    return await this.reviewRepository.findReceiverNickname(writerNickname, helpId);
  }
}
