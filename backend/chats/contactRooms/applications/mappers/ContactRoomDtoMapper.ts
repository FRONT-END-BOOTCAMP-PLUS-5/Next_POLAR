import { ContactRoom } from '@/backend/chats/contactRooms/domains/entities/ContactRoom';
import {
  ContactRoomResponseDto,
  ContactRoomListResponseDto,
  ContactRoomDetailResponseDto,
  ContactRoomDetailWithParticipantsResponseDto,
  ConnectedHelpDto,
  ParticipantDto,
  HelpInfoDto,
} from '../dtos/ContactRoomResponseDtos';
import { getNicknameByUuid } from '@/lib/getUserData';

export class ContactRoomDtoMapper {
  // Entity → ResponseDto 변환 (단일)
  static async toResponseDto(
    entity: ContactRoom
  ): Promise<ContactRoomResponseDto> {
    const juniorNickname = await getNicknameByUuid(entity.juniorId);
    const seniorNickname = await getNicknameByUuid(entity.seniorId);

    return {
      contactRoomId: entity.contactRoomId,
      helpId: entity.helpId,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: entity.createdAt,
    };
  }

  // Entities → ListResponseDto 변환 (배열)
  static async toListResponseDto(
    entities: ContactRoom[]
  ): Promise<ContactRoomListResponseDto> {
    const rooms = await Promise.all(
      entities.map((entity) => this.toResponseDto(entity))
    );

    return {
      rooms,
      totalCount: rooms.length,
    };
  }

  // Entity → DetailWithParticipantsResponseDto 변환 (참여자 정보 포함)
  static async toDetailWithParticipantsResponseDto(
    entity: ContactRoom,
    participants: {
      junior: ParticipantDto;
      senior: ParticipantDto;
    },
    helpInfo: HelpInfoDto
  ): Promise<ContactRoomDetailWithParticipantsResponseDto> {
    const juniorNickname = await getNicknameByUuid(entity.juniorId);
    const seniorNickname = await getNicknameByUuid(entity.seniorId);

    return {
      contactRoomId: entity.contactRoomId,
      helpId: entity.helpId,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: entity.createdAt,
      participants,
      helpInfo,
    };
  }

  // Entity + Helps + OpponentProfile + ReviewStats → DetailResponseDto 변환 (통일된 구조)
  static async toDetailResponseDto(
    entity: ContactRoom,
    helps: ConnectedHelpDto[],
    opponentProfile: {
      nickname: string;
      name: string;
      profileImgUrl: string;
      address: string;
    },
    reviewStats?: {
      averageRating: number;
      reviewCount: number;
    }
  ): Promise<ContactRoomDetailResponseDto> {
    const juniorNickname = await getNicknameByUuid(entity.juniorId);
    const seniorNickname = await getNicknameByUuid(entity.seniorId);

    return {
      contactRoomId: entity.contactRoomId,
      juniorNickname: juniorNickname || '알 수 없음',
      seniorNickname: seniorNickname || '알 수 없음',
      createdAt: entity.createdAt,
      opponentProfile,
      reviewStats,
      helps: helps.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  }
}
