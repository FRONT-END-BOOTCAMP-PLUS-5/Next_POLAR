// Junior 랭킹 관련 인프라스트럭처
// 이 파일에는 Junior 사용자의 랭킹과 관련된 외부 의존성 구현이 포함됩니다.

// 예시:
// - SupabaseJuniorRankRepository: Supabase 기반 랭킹 리포지토리
// - RedisCacheService: Redis 캐시 서비스
// - RankingCalculationService: 랭킹 계산 서비스
// - RewardService: 보상 지급 서비스
// - AnalyticsService: 분석 서비스

// 인프라스트럭처는 외부 의존성의 실제 구현을 담당하며, 인터페이스를 구현합니다.
import { supabase } from '@/backend/common/utils/supabaseClient';
import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import { ScoreMapper } from '@/backend/juniors/scores/infrastructures/mappers/ScoreMapper';
import { ScoreDBResponse } from '@/backend/juniors/scores/ScoreModel';
import { ScoreRepositoryInterface } from '@/backend/juniors/scores/domains/repositories/ScoreRepositoryInterface';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithNickname,
  ScoreRequestDtoWithNicknameAndSeason,
  ScoreRequestDtoWithNicknameAndCategoryId,
} from '@/backend/juniors/scores/applications/dtos/ScoreRequestDto';

export class ScoreRepository implements ScoreRepositoryInterface {
  private async queryScores(
    filters: Record<string, number | string>
  ): Promise<Score[]> {
    const scoreColumns = `
      user_id,
      category_id,
      season,
      category_score,
      updated_at,
      categories (
        id,
        name,
        point
      )
      `;

    const { data, error } = await supabase
      .from('scores')
      .select(scoreColumns)
      .match(filters);

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  // nickname 기반 조회를 위한 메서드 (JOIN 사용)
  private async queryScoresByNickname(
    nickname: string,
    additionalFilters: Record<string, number | string> = {}
  ): Promise<Score[]> {
    const scoreColumns = `
      user_id,
      users!inner(nickname),
      category_id,
      season,
      category_score,
      updated_at,
      categories (
        id,
        name,
        point
      )
    `;

    // nickname으로 scores 조회 (JOIN 사용)
    let query = supabase
      .from('scores')
      .select(scoreColumns)
      .eq('users.nickname', nickname);

    // 추가 필터 적용
    for (const [key, value] of Object.entries(additionalFilters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return ScoreMapper.toScoreEntity({
      scores: data,
    } as unknown as ScoreDBResponse);
  }

  async getScoresByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]> {
    return this.queryScores({ category_id: request.categoryId });
  }

  async getScoresBySeason(
    request: ScoreRequestDtoWithSeason
  ): Promise<Score[]> {
    return this.queryScores({ season: request.season });
  }

  async getScoresByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]> {
    return this.queryScores({
      category_id: request.categoryId,
      season: request.season,
    });
  }

  // nickname 기반 메서드들
  async getScoresByNickname(
    request: ScoreRequestDtoWithNickname
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname);
  }

  async getScoresByNicknameAndSeason(
    request: ScoreRequestDtoWithNicknameAndSeason
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname, {
      season: request.season,
    });
  }

  async getScoresByNicknameAndCategoryId(
    request: ScoreRequestDtoWithNicknameAndCategoryId
  ): Promise<Score[]> {
    return this.queryScoresByNickname(request.nickname, {
      category_id: request.categoryId,
    });
  }
}
