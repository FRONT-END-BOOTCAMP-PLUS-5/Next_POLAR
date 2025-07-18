import {
  CommonHelpEntity,
  CommonHelpWithNicknameEntity,
} from '@/backend/helps/domains/entities/CommonHelpEntity';

export interface ICommonHelpRepository {
  getHelpList(): Promise<CommonHelpEntity[] | null>;
  getHelpById(id: number): Promise<CommonHelpEntity | null>;
  // nickname을 포함한 조회 메서드들
  getHelpListWithNicknames(): Promise<CommonHelpWithNicknameEntity[] | null>;
  getHelpByIdWithNickname(
    id: number
  ): Promise<CommonHelpWithNicknameEntity | null>;
  // 헬프 생성 같은건 시니어 귀속?
}
