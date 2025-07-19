import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { ReceivedReviewsResponse, WrittenReviewsResponse } from '../models/review.model';
import { CreateReviewResponse } from '../models/review.model';

// 받은 리뷰 목록 조회
export const getReceivedReviews = async (nickname: string): Promise<ReceivedReviewsResponse> => {
  const response = await apiClient.get<ReceivedReviewsResponse>(
    `${API_ENDPOINTS.REVIEWS_RECEIVED}?nickname=${nickname}`
  );

  console.log(response.data);
  return response.data;
};

// 쓴 리뷰 목록 조회
export const getWrittenReviews = async (nickname: string): Promise<WrittenReviewsResponse> => {
  const response = await apiClient.get<WrittenReviewsResponse>(
    `${API_ENDPOINTS.REVIEWS_WRITTEN}?nickname=${nickname}`
  );
  return response.data;
};

// 리뷰 생성
export const createReview = async (formData: FormData): Promise<CreateReviewResponse> => {
  const response = await apiClient.post(
    `${API_ENDPOINTS.REVIEW_CREATE}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 리뷰 생성 권한 확인
export const checkReviewCreateAccess = async (nickname: string, helpId: number): Promise<boolean> => {
  const response = await apiClient.get<{ hasAccess: boolean }>(
    `${API_ENDPOINTS.REVIEW_CREATE_AUTH_CHECK}?nickname=${nickname}&helpId=${helpId}`
  );
  return response.data.hasAccess;
};

// 리뷰 상대방 조회
export const getReviewReceiver = async (nickname: string, helpId: number): Promise<{ receiverNickname: string; message: string }> => {
  const response = await apiClient.get<{ receiverNickname: string; message: string }>(
    `${API_ENDPOINTS.REVIEW_RECEIVER}?nickname=${nickname}&helpId=${helpId}`
  );
  return response.data;
}; 