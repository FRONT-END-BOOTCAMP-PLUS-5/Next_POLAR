export interface ChatRoom {
  chatRoomId: number; // 채팅방 고유 ID (새로 추가)
  helpId?: number; // help(매칭) 고유 ID (optional로 변경)
  juniorNickname: string; // 주니어 유저 ID (UUID)
  seniorNickname: string; // 시니어 유저 ID (UUID)
  createdAt: string; // 대화방 생성일 (ISO 문자열)
}
