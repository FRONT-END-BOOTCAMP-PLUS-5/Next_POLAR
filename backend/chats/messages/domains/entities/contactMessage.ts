// 현재 파일은 엔티티 정의만 있으므로 import 경로 변경 필요 없음.
export class ContactMessageEntity {
  constructor(
    public readonly id: number | undefined, // 메시지 고유 ID
    public contactRoomId: number,
    public sender_id: string,
    public nickname: string, // 닉네임
    public message: string, // 메시지 내용
    public readonly createdAt: Date | undefined // 생성일시
  ) {}

  toJSON() {
    return {
      id: this.id,
      contactRoomId: this.contactRoomId,
      nickname: this.nickname,
      message: this.message,
      createdAt: this.createdAt,
    };
  }
}
