export interface ChatRoom {
  chatRoomId: number;  // 채팅방 고유 ID (새로 추가)
  helpId?: number;     // help(매칭) 고유 ID (optional로 변경)
  juniorId: number;    // 주니어 유저 ID
  seniorId: number;    // 시니어 유저 ID
  createdAt: string;   // 대화방 생성일 (ISO 문자열)
} 