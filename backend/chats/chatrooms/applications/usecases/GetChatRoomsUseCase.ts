import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import {
  ChatRoomListResponseDto,
  ChatRoomResponseDto,
} from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';

export class GetChatRoomsUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // nickname이 참여한 모든 대화방 리스트 반환 (닉네임 기반)
  async execute(nickname: string): Promise<ChatRoomListResponseDto> {
    // uuid 변환 없이 nickname으로 바로 repository 호출
    const rooms = await this.chatRoomRepo.findRoomsByNickname(nickname);

    // 각 채팅방의 닉네임 반환 (이미 nickname 기반이면 변환 불필요)
    const roomDtos: ChatRoomResponseDto[] = rooms.map((room) => ({
      chatRoomId: room.chatRoomId,
      helpId: room.helpId,
      juniorNickname: room.juniorNickname,
      seniorNickname: room.seniorNickname,
      createdAt: room.createdAt,
    }));

    return {
      rooms: roomDtos,
      totalCount: roomDtos.length,
    };
  }
}
