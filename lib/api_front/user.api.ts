import { API_ENDPOINTS } from '../constants/api';
import apiClient from '../http.api';
import { UserProfile } from '../models/userProfile.model';

// 사용자 정보 조회
export const getUserProfile = async (nickname: string): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(
    API_ENDPOINTS.USER_PROFILE(nickname)
  );
  return response.data;
}; 