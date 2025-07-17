// API 응답용 리뷰 타입
export interface Review {
  id: number;
  helpId: number;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl?: string;
  writerProfileImgUrl?: string;
  createdAt: string;
}

// 받은 리뷰 목록 응답 타입
export interface ReceivedReviewsResponse {
  success: boolean;
  reviews: Review[];
  error?: string;
}

// 쓴 리뷰 목록 응답 타입
export interface WrittenReviewsResponse {
  success: boolean;
  reviews: Review[];
  error?: string;
}

// 리뷰 생성 요청 DTO
export interface CreateReviewRequest {
  helpId: string;
  rating: number;
  text: string;
  reviewImgFile?: File; // 파일 자체를 받도록 변경
}

// 리뷰 생성 응답 DTO
export interface CreateReviewResponse {
  helpId: string;
} 