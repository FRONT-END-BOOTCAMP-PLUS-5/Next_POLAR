// API 응답용 사용자 프로필 타입
export interface UserProfile {
  success: boolean;
  data: {
    name: string;
    nickname: string;
    age: number;
    profileImgUrl: string;
    address: string;
  };
}

// 기존 컴포넌트와 호환되는 사용자 프로필 타입
export interface LegacyUserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
} 