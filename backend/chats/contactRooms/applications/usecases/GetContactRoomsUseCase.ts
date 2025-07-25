import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { ContactRoomHelper } from '../helpers/ContactRoomHelper';

// 상세 정보가 포함된 채팅방 목록 응답 DTO
export interface ContactRoomWithDetailsDto {
  contactRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
  };
  latestHelp?: {
    id: number;
    title: string;
    category: { id: number; point: number }[];
    representativeImage: string;
    status: string;
  };
}

export interface ContactRoomListWithDetailsResponseDto {
  rooms: ContactRoomWithDetailsDto[];
  totalCount: number;
}

export class GetContactRoomsUseCase {
  private helper: ContactRoomHelper;

  constructor(
    private contactRoomRepo: IContactRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository,
    private userRepository: IUserRepository
  ) {
    this.helper = new ContactRoomHelper(
      contactRoomRepo,
      helpRepository,
      helpImageRepository,
      userRepository
    );
  }

  async execute(
    nickname: string
  ): Promise<ContactRoomListWithDetailsResponseDto> {
    // 1. 사용자가 참여한 모든 연락방 조회
    const rooms = await this.contactRoomRepo.findRoomsByUserId(nickname);

    // 2. 각 연락방에 상세 정보 추가
    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        // 3. 상대방 닉네임 및 프로필 정보 조회
        const { juniorNickname, seniorNickname } =
          await this.helper.getOpponentNickname(room, nickname);

        const opponentProfile = await this.helper.getOpponentProfile(
          room,
          nickname
        );

        // 4. 최근 help 정보 조회
        const latestHelp = await this.helper.getFirstHelpInfo(
          room.contactRoomId
        );

        return {
          contactRoomId: room.contactRoomId,
          helpId: room.helpId,
          juniorNickname,
          seniorNickname,
          createdAt: room.createdAt,
          opponentProfile: {
            nickname: opponentProfile.nickname,
            name: opponentProfile.name,
            profileImgUrl: opponentProfile.profileImgUrl,
          },
          latestHelp: latestHelp
            ? {
                id: latestHelp.id,
                title: latestHelp.title,
                category: latestHelp.category,
                representativeImage: latestHelp.representativeImage,
                status: latestHelp.status || '',
              }
            : undefined,
        };
      })
    );

    return {
      rooms: roomsWithDetails,
      totalCount: roomsWithDetails.length,
    };
  }
}
