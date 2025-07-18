import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import {
  ChatRoomListResponseDto,
  ChatRoomResponseDto,
} from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';
import { getUuidByNickname } from '@/lib/getUserData';

export class GetChatRoomsUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // nickname이 참여한 모든 대화방 리스트 반환 (닉네임 기반)
  async execute(nickname: string): Promise<ChatRoomListResponseDto> {
    const userId = await getUuidByNickname(nickname);
    if (!userId) throw new Error('User ID not found');
    const rooms = await this.chatRoomRepo.findRoomsByUserId(userId);

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
