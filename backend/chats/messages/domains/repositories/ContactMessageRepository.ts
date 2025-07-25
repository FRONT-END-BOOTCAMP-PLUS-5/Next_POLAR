import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { ContactMessageRequestDto } from '@/backend/chats/messages/applications/dtos/ContactMessageDtos';

export interface IContactMessageRepository {
  // 메시지 리스트 조회 (특정 채팅방)
  findByContactRoomId(contactRoomId: number): Promise<ContactMessageEntity[]>;

  // 메시지 생성 (nickname 기반)
  createChatMessage(
    requestDto: ContactMessageRequestDto
  ): Promise<ContactMessageEntity>;
}
