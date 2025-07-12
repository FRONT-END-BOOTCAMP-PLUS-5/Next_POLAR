import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ChatRoom } from '@/backend/chats/chatrooms/domains/entities/ChatRoom';
import { GetChatRoomDetailRequestDto } from '@/backend/chats/chatrooms/applications/dtos/ChatRoomRequestDtos';
import { ChatRoomDetailResponseDto } from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';

export class GetChatRoomDetailUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // chatRoomId로 대화방 1개 정보 반환
  async execute(request: GetChatRoomDetailRequestDto): Promise<ChatRoomDetailResponseDto | null> {
    const room = await this.chatRoomRepo.findRoomByChatRoomId(request.chatRoomId);
    
    if (!room) {
      return null;
    }

    return this.mapRoomToResponseDto(room);
  }

  // ChatRoom 엔티티를 응답 DTO로 매핑하는 private 메서드
  private mapRoomToResponseDto(room: ChatRoom): ChatRoomDetailResponseDto {
    return {
      chatRoomId: room.chatRoomId,
      helpId: room.helpId,
      juniorId: room.juniorId,
      seniorId: room.seniorId,
      createdAt: room.createdAt,
      participants: {
        junior: {
          id: room.juniorId,
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '' // TODO: 사용자 정보에서 가져와야 함
        },
        senior: {
          id: room.seniorId,
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '' // TODO: 사용자 정보에서 가져와야 함
        }
      },
      helpInfo: {
        title: '', // TODO: 헬프 정보에서 가져와야 함
        description: '', // TODO: 헬프 정보에서 가져와야 함
        status: '' // TODO: 헬프 정보에서 가져와야 함
      }
    };
  }
} 