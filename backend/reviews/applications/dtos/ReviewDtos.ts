// 리뷰 생성 요청 DTO
export interface CreateReviewRequest {
  helpId: number;
  writerNickname: string; // nickname
  rating: number;
  text: string;
  reviewImgUrl?: string; // 리뷰 이미지 URL (선택사항)
}

// 받은 리뷰 조회 요청 DTO
export interface ReceivedReviewsRequest {
  receiverNickname: string; // 닉네임
}

// 쓴 리뷰 조회 요청 DTO
export interface WrittenReviewsRequest {
  writerNickname: string; // 닉네임
}

// 리뷰 GET 응답 DTO
export interface ReviewResponseDto {
  id: number;
  helpId: number;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl?: string;
  createdAt: string;
}
