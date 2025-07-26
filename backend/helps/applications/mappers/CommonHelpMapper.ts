import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { HelpResponseDto } from '../dtos/HelpDTO';
import { getNicknameByUuid } from '@/lib/getUserData';

export class CommonHelpMapper {
  /**
   * CommonHelpEntity를 HelpResponseDto로 변환
   */
  static async toDto(entity: CommonHelpEntity): Promise<HelpResponseDto> {
    const seniorNickname = await getNicknameByUuid(entity.seniorId);

    return {
      id: entity.id,
      seniorInfo: {
        nickname: seniorNickname || '알 수 없음',
        name: '', // 별도로 조회 필요
        profileImgUrl: '', // 별도로 조회 필요
        address: '', // 별도로 조회 필요
        userRole: 'senior', // help를 생성하는 사람은 항상 senior
      },
      title: entity.title,
      startDate: entity.startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
      endDate: entity.endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
      category: entity.category,
      content: entity.content,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      images: [], // 별도로 조회 필요
    };
  }

  /**
   * CommonHelpEntity 배열을 HelpResponseDto 배열로 변환
   */
  static async toDtoList(
    entities: CommonHelpEntity[]
  ): Promise<HelpResponseDto[]> {
    return Promise.all(entities.map((entity) => this.toDto(entity)));
  }
}
