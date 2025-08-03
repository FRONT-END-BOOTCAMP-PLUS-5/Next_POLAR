import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';

export interface ICommonHelpRepository {
  getHelpList(): Promise<CommonHelpEntity[] | null>;
  getHelpById(id: number): Promise<CommonHelpEntity | null>;
  // 필터링된 헬프 리스트 조회
  getHelpListWithFilter(
    filter: HelpFilterDto
  ): Promise<CommonHelpEntity[] | null>;
  // 필터링된 헬프 개수 조회 (페이지네이션용)
  getHelpCountWithFilter(filter: HelpFilterDto): Promise<number>;
}
