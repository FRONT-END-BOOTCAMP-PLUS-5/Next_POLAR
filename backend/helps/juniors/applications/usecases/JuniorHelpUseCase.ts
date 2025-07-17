import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { IJuniorHelpRepository } from '@/backend/helps/juniors/domains/repositories/IJuniorHelpRepository';

// 지원한 헬프 리스트 조회 (닉네임 기반)
export class GetJuniorAppliedHelpListUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string): Promise<CommonHelpEntity[] | null> {
    // uuid 변환 없이 nickname으로 바로 repository 호출
    return await this.juniorHelpRepository.getJuniorAppliedHelpListByNickname(juniorNickname);
  }
}

// 헬프 지원 (닉네임 기반)
export class ApplyHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string, helpId: number): Promise<void | null> {
    return await this.juniorHelpRepository.applyHelpByNickname(juniorNickname, helpId);
  }
}

// 헬프 지원 취소 (닉네임 기반)
export class CancelJuniorHelpUseCase {
  constructor(private readonly juniorHelpRepository: IJuniorHelpRepository) {}

  async execute(juniorNickname: string, helpId: number): Promise<void | null> {
    return await this.juniorHelpRepository.cancelJuniorHelpByNickname(juniorNickname, helpId);
  }
}
