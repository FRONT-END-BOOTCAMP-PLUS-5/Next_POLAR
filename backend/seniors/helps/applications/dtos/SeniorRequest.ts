// 시니어 헬프 생성 요청 DTO (닉네임 기반)
export interface CreateSeniorHelpRequestDto {
  title: string;
  startDate: string;
  content?: string;
  category: number | number[];
  endDate?: string;
  imageFiles?: string[]; // 이미지 URL 배열 추가
}

// 시니어 헬프 수정 요청 DTO (닉네임 기반)
export interface UpdateSeniorHelpRequestDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  category?: number | number[];
  content?: string;
  status?: string;
}

// 시니어 헬프 응답 DTO (닉네임 기반)
export interface SeniorHelpResponseDto {
  id: number;
  seniorNickname: string; // UUID 대신 닉네임
  title: string;
  startDate: string;
  endDate?: string;
  category: number | number[];
  content?: string;
  status: string;
  createdAt: string;
}
