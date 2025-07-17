import { ReviewEntity } from '@/backend/reviews/domains/entities/review';

export class ReviewMapper {
  static toEntity(row: any): ReviewEntity {
    return new ReviewEntity(
      row.id,
      row.help_id,
      row.writer_id,
      row.receiver_id,
      row.writer_nickname,
      row.receiver_nickname,
      row.rating,
      row.text,
      row.review_img_url,
      new Date(row.created_at)
    );
  }
} 