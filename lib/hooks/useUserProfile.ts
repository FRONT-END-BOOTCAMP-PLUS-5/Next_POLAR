import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api_front/user.api';
import { UserProfile } from '../models/userProfile.model';

// 사용자 프로필 조회 훅
export function useUserProfile(nickname: string) {
  return useQuery<UserProfile, Error>({
    queryKey: ['users', 'profile', nickname],
    queryFn: () => getUserProfile(nickname),
    enabled: !!nickname,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
} 