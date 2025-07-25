import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { GetContactMessageResponseDto } from '../../applications/dtos/ContactMessageDtos';

export class ContactMessageMapper {
  static toEntity(row: {
    id: number;
    sender_id: string;
    contact_room_id: number;
    nickname: string;
    message: string;
    created_at: string;
  }): ContactMessageEntity {
    return new ContactMessageEntity(
      row.id,
      row.contact_room_id,
      row.sender_id,
      row.nickname,
      row.message,
      row.created_at
    );
  }

  static toResponseDto(
    entity: ContactMessageEntity
  ): GetContactMessageResponseDto {
    return {
      id: entity.id!,
      nickname: entity.nickname,
      contactRoomId: entity.contactRoomId,
      message: entity.message,
      createdAt: entity.createdAt,
    };
  }
}
