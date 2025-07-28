import { HelpApplicantEntity } from '@/backend/helps/domains/entities/HelpApplicant';
import { HelpApplicantDto } from '../dtos/HelpApplicantDto';
import { getNicknameByUuid } from '@/lib/getUserData';

export class HelpApplicantMapper {
  /**
   * HelpApplicantEntity를 HelpApplicantDto로 변환
   */
  static async toDto(entity: HelpApplicantEntity): Promise<HelpApplicantDto> {
    const juniorNickname = await getNicknameByUuid(entity.juniorId);

    return {
      id: entity.id,
      helpId: entity.helpId,
      juniorNickname: juniorNickname || '알 수 없음',
      isAccepted: entity.isAccepted,
      appliedAt: entity.appliedAt.toISOString(),
    };
  }

  /**
   * HelpApplicantEntity 배열을 HelpApplicantDto 배열로 변환
   */
  static async toDtoList(
    entities: HelpApplicantEntity[]
  ): Promise<HelpApplicantDto[]> {
    return Promise.all(entities.map((entity) => this.toDto(entity)));
  }
}
