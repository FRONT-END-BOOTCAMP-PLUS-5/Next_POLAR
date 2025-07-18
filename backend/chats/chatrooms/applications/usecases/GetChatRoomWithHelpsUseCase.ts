import { IChatRoomRepository } from '@/backend/chats/chatrooms/domains/repositories/IChatRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import {
  ChatRoomWithHelpsResponseDto,
  ConnectedHelpDto,
} from '@/backend/chats/chatrooms/applications/dtos/ChatRoomResponseDtos';

export class GetChatRoomWithHelpsUseCase {
  constructor(
    private chatRoomRepo: IChatRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository
  ) {}

  async execute(
    chatRoomId: number
  ): Promise<ChatRoomWithHelpsResponseDto | null> {
    // 1. 채팅방 정보 조회 (nickname 포함)
    const room = await this.chatRoomRepo.findRoomWithNicknamesByChatRoomId(
      chatRoomId
    );
    if (!room) {
      return null;
    }

    // 2. 연결된 helpId 목록 조회
    const helpIds = await this.chatRoomRepo.findHelpIdsByChatRoomId(chatRoomId);

    // 3. helps 정보 조회
    const helps: ConnectedHelpDto[] = [];
    if (helpIds && helpIds.length > 0) {
      for (const helpId of helpIds) {
        const help = await this.helpRepository.getHelpById(helpId);
        if (help) {
          // 대표 이미지 조회 (첫 번째 이미지)
          const images =
            await this.helpImageRepository.getHelpImageUrlsByHelpId(helpId);
          const representativeImage =
            images && images.length > 0 ? images[0] : '';

          helps.push({
            id: help.id,
            title: help.title,
            representativeImage,
            startDate: help.startDate.toISOString(),
            endDate: help.endDate.toISOString(),
            createdAt: help.createdAt.toISOString(),
          });
        }
      }
    }

    // 4. 결과 반환 (nickname은 이미 변환되어 있음)
    return {
      chatRoomId: room.chatRoomId,
      juniorNickname: room.juniorNickname,
      seniorNickname: room.seniorNickname,
      createdAt: room.createdAt,
      helps: helps.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ), // 최신순 정렬
    };
  }
}
