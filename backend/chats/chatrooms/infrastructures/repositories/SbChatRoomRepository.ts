// ===== 외부 라이브러리 및 인터페이스 import =====
import { supabase } from '@/backend/common/utils/supabaseClient';
import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';
import { ChatRoomMapper } from '@/backend/chats/chatrooms/infrastructures/mappers/ChatRoomMapper';
import { getNicknameByUuid } from '@/lib/getUserData';

// ===== Repository 구현체 =====
// IChatRoomRepository 인터페이스를 구현하는 실제 데이터베이스 접근 클래스
export class SbChatRoomRepository implements IChatRoomRepository {
  // ===== 사용자 ID로 참여한 모든 채팅방 조회 =====
  async findRoomsByUserId(userId: string): Promise<ChatRoom[]> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .or(`junior_id.eq.${userId},senior_id.eq.${userId}`);

    if (error) throw error;
    return ChatRoomMapper.toChatRooms(data ?? []);
  }

  // ===== chatRoomId로 특정 채팅방 조회 =====
  async findRoomByChatRoomId(chatRoomId: number): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', chatRoomId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 결과가 없는 경우
        return null;
      }
      throw error;
    }

    if (!data) return null;
    return ChatRoomMapper.toChatRoom(data);
  }

  // ===== chatRoomId로 특정 채팅방 조회 (nickname 포함) =====
  async findRoomWithNicknamesByChatRoomId(
    chatRoomId: number
  ): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', chatRoomId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 결과가 없는 경우
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // UUID를 nickname으로 변환
    const juniorNickname = await getNicknameByUuid(data.junior_id);
    const seniorNickname = await getNicknameByUuid(data.senior_id);

    return {
      chatRoomId: data.id,
      helpId: data.help_id,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: data.created_at,
    };
  }

  // ===== chatRoomId로 연결된 helpId 목록 조회 =====
  async findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from('contact_room_helps')
      .select('help_id')
      .eq('contact_room_id', chatRoomId);

    if (error) throw error;
    if (!data) return [];
    return data.map((row: { help_id: number }) => row.help_id);
  }
}
