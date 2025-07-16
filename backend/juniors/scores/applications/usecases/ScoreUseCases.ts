import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import { ScoreRepositoryInterface } from '@/backend/juniors/scores/domains/repositories/ScoreRepositoryInterface';
import {
  ScoreRequestDtoWithCategoryId,
  ScoreRequestDtoWithCategoryIdAndSeason,
  ScoreRequestDtoWithSeason,
  ScoreRequestDtoWithNickname,
  ScoreRequestDtoWithNicknameAndSeason,
  ScoreRequestDtoWithNicknameAndCategoryId,
} from '@/backend/juniors/scores/applications/dtos/ScoreRequestDto';

export class GetUserScoresUseCase {
  constructor(private scoreRepository: ScoreRepositoryInterface) {}

  async executeByCategoryId(
    request: ScoreRequestDtoWithCategoryId
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryId(request);
  }

  async executeBySeason(request: ScoreRequestDtoWithSeason): Promise<Score[]> {
    return await this.scoreRepository.getScoresBySeason(request);
  }

  async executeByCategoryIdAndSeason(
    request: ScoreRequestDtoWithCategoryIdAndSeason
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByCategoryIdAndSeason(request);
  }

  // nickname 기반 메서드들
  async executeByNickname(
    request: ScoreRequestDtoWithNickname
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByNickname(request);
  }

  async executeByNicknameAndSeason(
    request: ScoreRequestDtoWithNicknameAndSeason
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByNicknameAndSeason(request);
  }

  async executeByNicknameAndCategoryId(
    request: ScoreRequestDtoWithNicknameAndCategoryId
  ): Promise<Score[]> {
    return await this.scoreRepository.getScoresByNicknameAndCategoryId(request);
  }
}
