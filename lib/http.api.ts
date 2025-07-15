import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);

    // 에러 처리
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태인 경우
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('[API] 인증 실패');
          // 로그인 페이지로 리다이렉트 등의 처리
          break;
        case 403:
          console.error('[API] 권한 없음');
          break;
        case 404:
          console.error('[API] 리소스를 찾을 수 없음');
          break;
        case 500:
          console.error('[API] 서버 오류');
          break;
        default:
          console.error(`[API] ${status} 오류:`, data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('[API] 네트워크 오류');
    } else {
      // 요청 설정 중 오류
      console.error('[API] 요청 설정 오류:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API 에러 타입 정의
export interface ApiError {
  error: string;
  detail?: string;
  reason?: string;
}
