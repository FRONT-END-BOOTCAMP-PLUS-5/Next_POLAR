// 헬프 리스트 응답 DTO (닉네임 기반)
export interface HelpListResponseDto {
  id: number;
  seniorInfo: {
    nickname: string; // UUID 대신 닉네임
    name?: string;
    profileImgUrl?: string;
  };
  title: string;
  startDate: Date;
  endDate: Date;
  category: number[];
  content: string;
  status: string;
  createdAt: Date;
}

// 헬프 상세 응답 DTO (닉네임 기반)
export interface HelpDetailResponseDto {
  id: number;
  seniorNickname: string; // UUID 대신 닉네임
  title: string;
  startDate: Date;
  endDate: Date;
  category: number[];
  content: string;
  status: string;
  createdAt: Date;
}

// 헬프 미리보기 응답 DTO (채팅방용)
export interface HelpPreviewResponseDto {
  id: number;
  seniorNickname: string;
  title: string;
  startDate: Date;
  endDate: Date;
  category: number[];
  status: string;
  createdAt: Date;
  images?: string[]; // 이미지 URL 배열 추가
}

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
