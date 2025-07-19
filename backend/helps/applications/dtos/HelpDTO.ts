import { UserProfileResponseDto } from '@/backend/users/user/applications/dtos/UserDtos';

// 헬프 응답 DTO (닉네임 기반)
export interface HelpResponseDto {
  id: number;
  seniorInfo: UserProfileResponseDto;
  title: string;
  startDate: Date;
  endDate: Date;
  category: { id: number; point: number }[];
  content: string;
  status: string;
  createdAt: Date;
  images?: string[]; // 헬프 이미지 URL 배열
}

// 기존 호환성을 위한 타입 별칭
export type HelpListResponseDto = HelpResponseDto;
export type HelpDetailResponseDto = HelpResponseDto;

// 헬프 생성 요청 DTO (닉네임 기반)
export interface CreateHelpRequestDto {
  seniorNickname: string; // 요청 시 닉네임
  title: string;
  startDate: Date;
  endDate: Date;
  category: number[];
  content: string;
}

// 헬프 수정 요청 DTO (닉네임 기반)
export interface UpdateHelpRequestDto {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  category?: number[];
  content?: string;
}
