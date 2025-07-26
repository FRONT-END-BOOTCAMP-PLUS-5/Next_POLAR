import { HelpStatus } from '@/backend/common/entities/HelpStatus';

// 도움 상태 리포지토리 인터페이스
export interface IHelpStatusRepository {
  updateHelpStatus(helpId: number, status: HelpStatus): Promise<boolean>;
  getHelpStatus(helpId: number): Promise<HelpStatus | null>;
}
