// ===== 조회 응답 DTOs =====

// 채팅방 기본 정보 응답 DTO
export interface ChatRoomResponseDto {
  chatRoomId: number;
  helpId?: number;
  juniorId: number;
  seniorId: number;
  createdAt: string;
}

// 채팅방 목록 응답 DTO
export interface ChatRoomListResponseDto {
  rooms: ChatRoomResponseDto[];
  totalCount: number;
}

// 채팅방 상세 정보 응답 DTO
export interface ChatRoomDetailResponseDto extends ChatRoomResponseDto {
  participants: {
    junior: {
      id: number;
      name: string;
      profileImgUrl: string;
    };
    senior: {
      id: number;
      name: string;
      profileImgUrl: string;
    };
  };
  helpInfo?: {
    title: string;
    description: string;
    status: string;
  };
} 