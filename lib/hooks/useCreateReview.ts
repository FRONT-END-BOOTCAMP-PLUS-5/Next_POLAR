import { useMutation } from '@tanstack/react-query';
import { createReview } from '../api_front/review.api';
// import { CreateReviewRequest } from '../models/review.model'; // 더 이상 사용하지 않음

export function useCreateReview(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: (formData: FormData) => createReview(formData),
    ...options,
  });
} 