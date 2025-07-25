import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import {
  ConnectedHelpDto,
  ContactRoomDetailResponseDto,
} from '@/backend/chats/contactRooms/applications/dtos/ContactRoomResponseDtos';
import { ContactRoomDtoMapper } from '../mappers/ContactRoomDtoMapper';
import { ContactRoomHelper } from '../helpers/ContactRoomHelper';

export class GetContactRoomDetailUseCase {
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
    contactRoomId: number,
    currentUserNickname: string
  ): Promise<ContactRoomDetailResponseDto | null> {
    // 1. 연락방 정보 조회
    const room = await this.contactRoomRepo.findRoomByContactRoomId(
      contactRoomId
    );
    if (!room) {
      return null;
    }

    // 2. 상대방 프로필 정보 조회
    const opponentProfile = await this.helper.getOpponentProfile(
      room,
      currentUserNickname
    );

    // 3. 첫 번째 help 정보 조회
    const firstHelp = await this.helper.getFirstHelpInfo(contactRoomId);

    // 4. ConnectedHelpDto 형태로 변환
    const helps: ConnectedHelpDto[] = [];
    if (firstHelp) {
      helps.push({
        id: firstHelp.id,
        title: firstHelp.title,
        representativeImage: firstHelp.representativeImage,
        startDate: firstHelp.startDate!,
        endDate: firstHelp.endDate!,
        createdAt: firstHelp.createdAt!,
        category: firstHelp.category,
      });
    }

    // 5. 매퍼를 사용하여 Entity를 DTO로 변환 (review 데이터 없음)
    return ContactRoomDtoMapper.toDetailResponseDto(room, helps, {
      nickname: opponentProfile.nickname,
      name: opponentProfile.name,
      profileImgUrl: opponentProfile.profileImgUrl,
      address: opponentProfile.address || '',
    });
  }
}
