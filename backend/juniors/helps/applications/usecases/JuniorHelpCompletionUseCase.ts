// 주니어 Help 완료 처리 유스케이스
import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository';
import { IJuniorHelpStatusRepository } from '@/backend/juniors/helps/domains/repositories/IJuniorHelpStatusRepository';
import { HelpStatus } from '@/backend/common/entities/HelpStatus';
import {
  JuniorsHelpCompletionDto,
  JuniorsHelpCompletionResponseDto,
} from '../dtos/JuniorsHelpCompletionDto';

export class JuniorHelpCompletionUseCase {
  constructor(
    private helpStatusRepository: IHelpStatusRepository,
    private juniorHelpStatusRepository: IJuniorHelpStatusRepository
  ) {}

  async completeHelp(
    request: JuniorsHelpCompletionDto
  ): Promise<JuniorsHelpCompletionResponseDto> {
    const currentStatus = await this.helpStatusRepository.getHelpStatus(
      request.helpId
    );
    if (!currentStatus) {
      throw new Error('Help를 찾을 수 없습니다.');
    }

    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(request.helpId);
    if (!storedVerification) {
      throw new Error('인증 코드가 만료되었거나 존재하지 않습니다.');
    }

    if (storedVerification.code !== request.verificationCode) {
      throw new Error('유효하지 않은 인증 코드입니다.');
    }

    const currentTime = Date.now();
    const expiryTime = Number(storedVerification.expiresAt);

    if (currentTime > expiryTime) {
      throw new Error('인증 코드가 만료되었습니다.');
    }

    await this.juniorHelpStatusRepository.deleteVerificationCode(
      request.helpId
    );
    const result = await this.helpStatusRepository.updateHelpStatus(
      request.helpId,
      HelpStatus.COMPLETED
    );

    return new JuniorsHelpCompletionResponseDto(result);
  }

  async validateCode(helpId: number, inputCode: number): Promise<boolean> {
    const storedVerification =
      await this.juniorHelpStatusRepository.getVerificationCode(helpId);
    if (!storedVerification) {
      return false;
    }

    // 코드 일치 및 만료 시간 확인
    return (
      storedVerification.code === inputCode &&
      new Date() < new Date(storedVerification.expiresAt)
    );
  }
}
