import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';
import { HelpApplicantEntity } from '@/backend/helps/domains/entities/HelpApplicant';
import { ApplicationStatusResponseDto } from '../dtos/HelpApplicationDto';
import { getUuidByNickname } from '@/lib/getUserData';

// 헬프 지원 UseCase
export class ApplyHelpUseCase {
  constructor(private readonly applicantRepository: IHelpApplicantRepository) {}

  async execute(
    helpId: number,
    juniorNickname: string
  ): Promise<HelpApplicantEntity> {
    // nickname을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 중복 지원 체크
    const isDuplicate =
      await this.applicantRepository.checkDuplicateApplication(
        helpId,
        juniorId
      );
    if (isDuplicate) {
      throw new Error('이미 지원한 헬프입니다.');
    }

    const applicant = new HelpApplicantEntity(
      0, // ID는 DB에서 자동 생성
      helpId,
      juniorId,
      false, // isAccepted는 기본적으로 false
      new Date() // appliedAt은 현재 시간
    );

    // Repository에 저장
    return await this.applicantRepository.createHelpApplication(applicant);
  }
}

// 헬프 지원자 수락 UseCase
export class AcceptHelpApplicantUseCase {
  constructor(private readonly applicantRepository: IHelpApplicantRepository) {}

  async execute(
    helpId: number,
    juniorNickname: string
  ): Promise<HelpApplicantEntity> {
    // nickname을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 지원자 정보 조회
    const applicants = await this.applicantRepository.getApplicantsByHelpId(
      helpId
    );
    const applicant = applicants.find((a) => a.juniorId === juniorId);

    if (!applicant) {
      throw new Error('지원자를 찾을 수 없습니다.');
    }

    // Repository에 업데이트 (isAccepted만 true로 변경)
    return await this.applicantRepository.acceptHelpApplicant(applicant);
  }
}

// 헬프 지원 상태 확인 UseCase
export class CheckHelpApplicationStatusUseCase {
  constructor(private readonly applicantRepository: IHelpApplicantRepository) {}

  async execute(
    helpId: number,
    juniorNickname: string
  ): Promise<ApplicationStatusResponseDto> {
    // nickname을 UUID로 변환
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      return {
        hasApplied: false,
        isAccepted: false,
      };
    }

    // 지원자 정보 조회
    const applicants = await this.applicantRepository.getApplicantsByHelpId(
      helpId
    );
    const applicant = applicants.find((a) => a.juniorId === juniorId);

    if (!applicant) {
      return {
        hasApplied: false,
        isAccepted: false,
      };
    }

    return {
      hasApplied: true,
      isAccepted: applicant.isAccepted,
      appliedAt: applicant.appliedAt.toISOString(),
    };
  }
}
