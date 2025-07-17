import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { UploadImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// POST /api/reviews/create
export async function POST(request: NextRequest) {
  // 트랜잭션 시뮬레이션 (실제 DB 트랜잭션은 아니지만, 순차적 실패 시 롤백)
  let reviewImgUrl = null;
  try {
    const formData = await request.formData();
    const helpId = formData.get('helpId');
    const rating = formData.get('rating');
    const text = formData.get('text');
    const file = formData.get('reviewImgFile');
    const writerNickname = formData.get('writerNickname');

    if (!helpId || !rating || !text || !writerNickname) {
      return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 });
    }

    // 1. 이미지 업로드 (있을 때만)
    if (file && file instanceof File) {
      const uploadImageUseCase = new UploadImageUseCase(new SbImageRepository());
      const uploadResult = await uploadImageUseCase.execute(file, 'review-images', String(writerNickname));
      reviewImgUrl = uploadResult.url;
    }

    // 2. 리뷰 생성 (nickname 기반)
    const review = await reviewUseCases.createReview({
      helpId: Number(helpId),
      writerNickname: String(writerNickname),
      rating: Number(rating),
      text: String(text),
      reviewImgUrl: reviewImgUrl || undefined,
    });

    return NextResponse.json({ helpId: review.helpId }, { status: 201 });
  } catch (error: unknown) {
    // 트랜잭션 실패 시 이미지 롤백 등 추가 구현 가능
    console.error('[API] 리뷰 생성 트랜잭션 오류:', error);
    return NextResponse.json({ error: '리뷰 생성 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 