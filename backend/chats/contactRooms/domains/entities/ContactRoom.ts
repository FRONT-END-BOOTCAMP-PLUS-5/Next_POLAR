export interface ContactRoom {
  contactRoomId: number; // 연락방 고유 ID
  helpId?: number; // help(매칭) 고유 ID (optional)
  juniorId: string; // 주니어 유저 UUID
  seniorId: string; // 시니어 유저 UUID
  createdAt: string; // 연락방 생성일 (ISO 문자열)
}
