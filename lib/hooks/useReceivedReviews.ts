import { useQuery } from '@tanstack/react-query';
import { getReceivedReviews } from '../api_front/review.api';
import { Review, ReceivedReviewsResponse } from '../models/review.model';

// 받은 리뷰 목록 조회 훅
export function useReceivedReviews(nickname: string) {
  return useQuery<ReceivedReviewsResponse, Error>({
    queryKey: ['reviews', 'received', nickname],
    queryFn: () => getReceivedReviews(nickname),
    enabled: !!nickname,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
} 