import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { ContactRoom } from '@/backend/chats/contactRooms/domains/entities/ContactRoom';
import { getUuidByNickname, getNicknameByUuid } from '@/lib/getUserData';

export interface OpponentProfile {
  nickname: string;
  name: string;
  profileImgUrl: string;
  address?: string;
}

export interface HelpInfo {
  id: number;
  title: string;
  category: { id: number; point: number }[];
  representativeImage: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export class ContactRoomHelper {
  constructor(
    private contactRoomRepo: IContactRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * 연락방에서 상대방 프로필 정보를 조회합니다.
   */
  async getOpponentProfile(
    room: ContactRoom,
    currentUserNickname: string
  ): Promise<OpponentProfile> {
    // 1. 현재 사용자 UUID 조회
    const currentUserUuid = await getUuidByNickname(currentUserNickname);
    if (!currentUserUuid) {
      throw new Error('현재 사용자 UUID를 찾을 수 없습니다.');
    }

    // 2. 상대방 UUID 결정
    const opponentUuid =
      room.juniorId === currentUserUuid ? room.seniorId : room.juniorId;

    // 3. 상대방 프로필 정보 조회
    const opponentUser = await this.userRepository.getUserById(opponentUuid);

    return {
      nickname: opponentUser?.nickname || '알 수 없음',
      name: opponentUser?.name || '이름 없음',
      profileImgUrl: opponentUser?.profileImgUrl || '',
      address: opponentUser?.address || '',
    };
  }

  /**
   * 연락방에서 상대방 닉네임을 조회합니다 (리스트용).
   */
  async getOpponentNickname(
    room: ContactRoom,
    currentUserNickname: string
  ): Promise<{
    juniorNickname: string;
    seniorNickname: string;
    opponentNickname: string;
  }> {
    // 1. 주니어/시니어 닉네임 조회
    const juniorNickname = await getNicknameByUuid(room.juniorId);
    const seniorNickname = await getNicknameByUuid(room.seniorId);

    // 2. 상대방 닉네임 결정
    const opponentNickname =
      juniorNickname === currentUserNickname ? seniorNickname : juniorNickname;

    return {
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      opponentNickname: opponentNickname || '알 수 없음',
    };
  }

  /**
   * 연락방의 첫 번째 help 정보를 조회합니다.
   */
  async getFirstHelpInfo(contactRoomId: number): Promise<HelpInfo | undefined> {
    // 1. 연결된 helpId 목록 조회
    const helpIds = await this.contactRoomRepo.findHelpIdsByContactRoomId(
      contactRoomId
    );

    if (!helpIds || helpIds.length === 0) {
      return undefined;
    }

    // 2. 첫 번째 help 정보 조회
    const firstHelpId = helpIds[0];
    const help = await this.helpRepository.getHelpById(firstHelpId);

    if (!help) {
      return undefined;
    }

    // 3. 대표 이미지 조회
    const images = await this.helpImageRepository.getHelpImageUrlsByHelpId(
      firstHelpId
    );
    const representativeImage = images && images.length > 0 ? images[0] : '';

    return {
      id: help.id,
      title: help.title,
      category: help.category,
      representativeImage,
      status: help.status,
      startDate: help.startDate.toISOString(),
      endDate: help.endDate.toISOString(),
      createdAt: help.createdAt.toISOString(),
    };
  }

  /**
   * 연락방의 모든 help 정보를 조회합니다.
   */
  async getAllHelpInfos(contactRoomId: number): Promise<HelpInfo[]> {
    // 1. 연결된 helpId 목록 조회
    const helpIds = await this.contactRoomRepo.findHelpIdsByContactRoomId(
      contactRoomId
    );

    if (!helpIds || helpIds.length === 0) {
      return [];
    }

    // 2. 모든 help 정보 조회
    const helpInfos = await Promise.all(
      helpIds.map(async (helpId) => {
        const help = await this.helpRepository.getHelpById(helpId);
        if (!help) return null;

        // 대표 이미지 조회
        const images = await this.helpImageRepository.getHelpImageUrlsByHelpId(
          helpId
        );
        const representativeImage =
          images && images.length > 0 ? images[0] : '';

        return {
          id: help.id,
          title: help.title,
          category: help.category,
          representativeImage,
          status: help.status,
          startDate: help.startDate.toISOString(),
          endDate: help.endDate.toISOString(),
          createdAt: help.createdAt.toISOString(),
        };
      })
    );

    return helpInfos.filter(
      (help): help is NonNullable<typeof help> => help !== null
    );
  }
}
