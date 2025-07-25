// ===== 외부 라이브러리 및 인터페이스 import =====
import { supabase } from '@/backend/common/utils/supabaseClient';
import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ContactRoom } from '@/backend/chats/contactRooms/domains/entities/ContactRoom';
import { getUuidByNickname } from '@/lib/getUserData';
import {
  ContactRoomMapper,
  ContactRoomDbRow,
} from '../mappers/ContactRoomMapper';

// ===== Repository 구현체 =====
// IContactRoomRepository 인터페이스를 구현하는 실제 데이터베이스 접근 클래스
export class SbContactRoomRepository implements IContactRoomRepository {
  // ===== 사용자 ID로 참여한 모든 연락방 조회 =====
  async findRoomsByUserId(nickname: string): Promise<ContactRoom[]> {
    const userId = await getUuidByNickname(nickname);
    if (!userId) throw new Error('User ID not found');

    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .or(`junior_id.eq.${userId},senior_id.eq.${userId}`);

    if (error) throw error;

    // 매퍼를 사용하여 DB 데이터를 Entity로 변환
    return ContactRoomMapper.toEntities(data as ContactRoomDbRow[]);
  }

  // ===== contactRoomId로 특정 연락방 조회 =====
  async findRoomByContactRoomId(
    contactRoomId: number
  ): Promise<ContactRoom | null> {
    const { data, error } = await supabase
      .from('contact_rooms')
      .select('*')
      .eq('id', contactRoomId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 결과가 없는 경우
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // 매퍼를 사용하여 DB 데이터를 Entity로 변환
    return ContactRoomMapper.toEntity(data as ContactRoomDbRow);
  }

  // ===== contactRoomId로 연결된 helpId 목록 조회 =====
  async findHelpIdsByContactRoomId(contactRoomId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from('contact_room_helps')
      .select('help_id')
      .eq('contact_room_id', contactRoomId);

    if (error) throw error;
    if (!data) return [];
    return data.map((row: { help_id: number }) => row.help_id);
  }

  // ===== nickname이 특정 연락방에 접근 권한이 있는지 확인 =====
  async checkUserAccessToContactRoom(
    nickname: string,
    contactRoomId: number
  ): Promise<boolean> {
    try {
      // 1. nickname을 UUID로 변환
      const userId = await getUuidByNickname(nickname);
      if (!userId) {
        return false;
      }

      // 2. 연락방 정보 조회
      const { data, error } = await supabase
        .from('contact_rooms')
        .select('junior_id, senior_id')
        .eq('id', contactRoomId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 연락방이 존재하지 않는 경우
          return false;
        }
        throw error;
      }

      if (!data) return false;

      // 3. 사용자가 해당 연락방의 참여자인지 확인
      const isParticipant =
        data.junior_id === userId || data.senior_id === userId;
      return isParticipant;
    } catch (error) {
      console.error('checkUserAccessToContactRoom error:', error);
      return false;
    }
  }
}
