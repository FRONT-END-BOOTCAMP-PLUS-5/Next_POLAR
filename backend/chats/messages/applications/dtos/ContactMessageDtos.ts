// UseCase에서 사용하는 DTO (백엔드 내부)
export type CreateContactMessageDto = {
  nickname: string; // 닉네임(신규 컬럼)
  contactRoomId: number;
  message: string;
};

// API 응답 DTO (닉네임 기반)
export type ContactMessageResponseDto = {
  id: number;
  nickname: string; // 응답 시 닉네임
  contactRoomId: number;
  message: string;
  createdAt: string;
};

// 메시지 목록 응답 DTO
export type ContactMessageListResponseDto = {
  messages: ContactMessageResponseDto[];
  totalCount: number;
};

export class ContactMessageRequestDto {
  constructor(
    public readonly nickname: string,
    public readonly contactRoomId: number,
    public readonly message: string
  ) {}
}

export interface ContactMessageUseCase {
  nickname: string;
  contactRoomId: number;
  message: string;
}
