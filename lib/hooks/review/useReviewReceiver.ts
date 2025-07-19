import { useQuery } from '@tanstack/react-query';
import { getReviewReceiver } from '@/lib/api_front/review.api';

interface ReviewReceiverResponse {
  receiverNickname: string;
  message: string;
}

export const useReviewReceiver = (nickname: string, helpId: number) => {
  return useQuery<ReviewReceiverResponse, Error>({
    queryKey: ['review', 'receiver', nickname, helpId],
    queryFn: () => getReviewReceiver(nickname, helpId),
    enabled: !!nickname && !!helpId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
}; 