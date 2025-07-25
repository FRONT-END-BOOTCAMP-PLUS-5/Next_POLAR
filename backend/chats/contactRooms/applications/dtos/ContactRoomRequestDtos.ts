// ===== 조회 요청 DTOs =====

// 사용자 연락방 목록 조회 요청 DTO
export interface GetUserContactRoomsRequestDto {
  nickname: string;
}

// 연락방 상세 정보 조회 요청 DTO
export interface GetContactRoomDetailRequestDto {
  contactRoomId: number;
}
