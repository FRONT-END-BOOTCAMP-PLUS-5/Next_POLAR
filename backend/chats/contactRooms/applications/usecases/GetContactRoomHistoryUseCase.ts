import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import {
  ConnectedHelpDto,
  ContactRoomDetailResponseDto,
} from '@/backend/chats/contactRooms/applications/dtos/ContactRoomResponseDtos';
import { ContactRoomDtoMapper } from '../mappers/ContactRoomDtoMapper';
import { getUuidByNickname } from '@/lib/getUserData';
import { supabase } from '@/backend/common/utils/supabaseClient';

export class GetContactRoomHistoryUseCase {
  constructor(
    private contactRoomRepo: IContactRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository,
    private userRepository: IUserRepository
  ) {}

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

    // 2. 현재 사용자 UUID 조회
    const currentUserUuid = await getUuidByNickname(currentUserNickname);

    // 3. 상대방 UUID 결정
    const opponentUuid =
      room.juniorId === currentUserUuid ? room.seniorId : room.juniorId;

    // 4. 상대방 프로필 정보 조회
    const opponentUser = await this.userRepository.getUserById(opponentUuid);

    // 5. 상대방 리뷰 통계 조회
    let reviewStats = {
      averageRating: 0,
      reviewCount: 0,
    };

    if (opponentUser?.nickname) {
      try {
        // star_points 테이블에서 해당 사용자의 리뷰 통계 조회
        const { data: starPointsData, error: starPointsError } = await supabase
          .from('star_points')
          .select('star_point_sum, review_total_count')
          .eq('user_id', opponentUuid)
          .single();

        if (!starPointsError && starPointsData) {
          const { star_point_sum, review_total_count } = starPointsData;
          const averageRating =
            review_total_count > 0
              ? Math.round((star_point_sum / review_total_count) * 10) / 10
              : 0;

          reviewStats = {
            averageRating,
            reviewCount: review_total_count,
          };
        }
      } catch (error) {
        console.error('리뷰 통계 조회 중 오류:', error);
        // 오류 발생 시 기본값 유지
      }
    }

    // 6. 연결된 helpId 목록 조회
    const helpIds = await this.contactRoomRepo.findHelpIdsByContactRoomId(
      contactRoomId
    );

    // 7. helps 정보 조회
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
            category: help.category,
          });
        }
      }
    }

    // 8. 매퍼를 사용하여 응답 생성 (review 데이터 포함)
    return ContactRoomDtoMapper.toDetailResponseDto(
      room,
      helps,
      {
        nickname: opponentUser?.nickname || '',
        name: opponentUser?.name || '',
        profileImgUrl: opponentUser?.profileImgUrl || '',
        address: opponentUser?.address || '',
      },
      {
        averageRating: reviewStats?.averageRating || 0,
        reviewCount: reviewStats?.reviewCount || 0,
      }
    );
  }
}
