import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';

export interface IChatRoomRepository {
  // userId가 참여한 모든 대화방 리스트 조회
  findRoomsByUserId(userId: number): Promise<ChatRoom[]>;

  // chatRoomId로 연결된 helpId 목록 조회
  findHelpIdsByChatRoomId(chatRoomId: number): Promise<number[]>;
} 