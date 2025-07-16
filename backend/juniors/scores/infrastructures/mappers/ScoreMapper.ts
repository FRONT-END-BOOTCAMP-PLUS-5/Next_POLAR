import { Category } from '@/backend/juniors/scores/domains/entities/Category';
import { Score } from '@/backend/juniors/scores/domains/entities/Score';
import {
  ScoreDBResponse,
  ScoreDBResponseSingle,
} from '@/backend/juniors/scores/ScoreModel';

export class ScoreMapper {
  static toScoreEntity({ scores }: ScoreDBResponse) {
    return scores.map((score: ScoreDBResponseSingle) => {
      // nickname이 직접 있거나 users.nickname에서 가져오기
      const nickname = score.nickname || score.users?.nickname || '';

      return new Score(
        nickname,
        score.category_id,
        score.season,
        score.category_score,
        score.updated_at,
        new Category(
          score.categories.id,
          score.categories.name,
          score.categories.point
        )
      );
    });
  }
}
