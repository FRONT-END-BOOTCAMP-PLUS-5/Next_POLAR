import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api';

interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  nickname: string;
  role: string;
}

export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    credentials
  );
  return response.data;
};
