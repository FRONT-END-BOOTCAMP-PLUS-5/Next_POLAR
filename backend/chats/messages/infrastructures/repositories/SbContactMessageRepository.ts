import { supabase } from '@/backend/common/utils/supabaseClient';
import { ContactMessageEntity } from '@/backend/chats/messages/domains/entities/contactMessage';
import { IContactMessageRepository } from '@/backend/chats/messages/domains/repositories/ContactMessageRepository';
import { ContactMessageMapper } from '@/backend/chats/messages/infrastructures/mappers/ContactMessageMapper';
import { ContactMessageUseCase } from '@/backend/chats/messages/applications/dtos/ContactMessageDtos';

export class SbContactMessageRepository implements IContactMessageRepository {
  // 메시지 저장
  async create(
    requestDto: { nickname: string; contactRoomId: number; message: string }
  ): Promise<ContactMessageEntity> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        nickname: requestDto.nickname,
        contact_room_id: requestDto.contactRoomId,
        message: requestDto.message,
      })
      .select()
      .single();

    if (error) {
      console.error('[Repository] 메시지 생성 오류:', error);
      throw error;
    }

    if (!data) {
      console.error('[Repository] 메시지 생성 실패 - 데이터 없음');
      throw new Error('메시지 생성 실패');
    }

    return ContactMessageMapper.toEntity(data);
  }

  // 메시지 리스트 조회
  async findByContactRoomId(
    contactRoomId: number
  ): Promise<ContactMessageEntity[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('contact_room_id', contactRoomId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(
      (row: {
        id: number;
        contact_room_id: number;
        nickname: string;
        message: string;
        created_at: string;
      }) => ContactMessageMapper.toEntity(row)
    );
  }
}
