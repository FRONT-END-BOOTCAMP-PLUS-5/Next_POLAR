import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithNickname,
  ScoreRequestDtoWithNicknameAndSeason,
  ScoreRequestDtoWithNicknameAndCategoryId,
} from '@/backend/juniors/scores/applications/dtos/ScoreRequestDto';

export interface ScoreRepositoryInterface {
  getScoresByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]>;
  getScoresBySeason(request: ScoreRequestDtoWithSeason): Promise<Score[]>;
  getScoresByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]>;

  // nickname 기반 메서드들
  getScoresByNickname(request: ScoreRequestDtoWithNickname): Promise<Score[]>;
  getScoresByNicknameAndSeason(
    request: ScoreRequestDtoWithNicknameAndSeason
  ): Promise<Score[]>;
  getScoresByNicknameAndCategoryId(
    request: ScoreRequestDtoWithNicknameAndCategoryId
  ): Promise<Score[]>;
}
