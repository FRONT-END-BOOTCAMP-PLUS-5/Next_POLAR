// 시니어 Help 완료 요청 유스케이스
import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository';
import {
  generateVerificationCode,
  getVerificationExpiryTime,
} from '@/lib/verify';
import { createVerificationCode } from '@/backend/seniors/helps/infrastructures/repositories/SeniorHelpStatusRepositories';
import { HelpStatus } from '@/backend/common/entities/HelpStatus';

export class SeniorHelpCompletionUseCase {
  constructor(private helpStatusRepository: IHelpStatusRepository) {}

  // 시니어: 완료 요청 (DB에 인증 코드 생성) - CONNECTING 상태에서만 가능
  async requestCompletion(helpId: number): Promise<number> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(helpId);
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    // CONNECTING 상태에서만 완료 요청 가능
    if (currentStatus !== HelpStatus.CONNECTING) {
      throw new Error('CONNECTING 상태에서만 완료를 요청할 수 있습니다.');
    }

    // 인증 코드 생성
    const verificationCode = generateVerificationCode();
    const expiresAt = getVerificationExpiryTime(); // 10분 뒤

    // DB에 인증 코드 저장 (트리거로 만료된 코드 자동 삭제)
    await createVerificationCode(helpId, verificationCode, expiresAt);

    return verificationCode;
  }
}
