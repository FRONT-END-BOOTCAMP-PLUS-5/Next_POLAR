// ===== 조회 요청 DTOs =====

// 사용자 채팅방 목록 조회 요청 DTO
export interface GetUserChatRoomsRequestDto {
  userId: number;
}

// 채팅방 상세 정보 조회 요청 DTO
export interface GetChatRoomDetailRequestDto {
  chatRoomId: number;
} 