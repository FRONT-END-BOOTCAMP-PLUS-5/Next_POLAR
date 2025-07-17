import { useQuery } from '@tanstack/react-query';
import { getWrittenReviews } from '../api_front/review.api';
import { Review, WrittenReviewsResponse } from '../models/review.model';

// 쓴 리뷰 목록 조회 훅
export function useWrittenReviews(nickname: string) {
  return useQuery<WrittenReviewsResponse, Error>({
    queryKey: ['reviews', 'written', nickname],
    queryFn: () => getWrittenReviews(nickname),
    enabled: !!nickname,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
} 