import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';

export class CheckContactRoomAccessUseCase {
  constructor(private contactRoomRepo: IContactRoomRepository) {}

  async execute(nickname: string, contactRoomId: number): Promise<boolean> {
    try {
      // repository의 메서드를 사용하여 접근 권한 확인
      return await this.contactRoomRepo.checkUserAccessToContactRoom(
        nickname,
        contactRoomId
      );
    } catch (error) {
      console.error('CheckContactRoomAccessUseCase error:', error);
      return false;
    }
  }
}
