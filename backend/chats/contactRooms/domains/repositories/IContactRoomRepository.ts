import { ContactRoom } from '@/backend/chats/contactRooms/domains/entities/ContactRoom';

export interface IContactRoomRepository {
  // userId가 참여한 모든 연락방 리스트 조회
  findRoomsByUserId(nickname: string): Promise<ContactRoom[]>;

  // contactRoomId로 특정 연락방 조회
  findRoomByContactRoomId(contactRoomId: number): Promise<ContactRoom | null>;

  // contactRoomId로 연결된 helpId 목록 조회
  findHelpIdsByContactRoomId(contactRoomId: number): Promise<number[]>;

  // nickname이 특정 연락방에 접근 권한이 있는지 확인
  checkUserAccessToContactRoom(
    nickname: string,
    contactRoomId: number
  ): Promise<boolean>;
}
