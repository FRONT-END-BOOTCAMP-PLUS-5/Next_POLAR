import { Category } from '@/backend/juniors/scores/domains/entities/Category';

export interface ScoreDBResponse {
  scores: ScoreDBResponseSingle[];
}

export interface ScoreDBResponseSingle {
  user_id: number;
  nickname?: string; // JOIN으로 가져올 수 있는 필드
  category_id: number;
  season: number;
  category_score: number;
  updated_at: string;
  categories: Category;
  users?: {
    nickname: string;
  };
}
