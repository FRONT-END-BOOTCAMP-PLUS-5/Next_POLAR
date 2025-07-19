import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터에서 nickname과 helpId 추출
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');
    const helpId = searchParams.get('helpId');

    if (!nickname) {
      return NextResponse.json(
        { error: 'nickname이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!helpId) {
      return NextResponse.json(
        { error: 'helpId가 필요합니다.' },
        { status: 400 }
      );
    }

    // UseCase 생성 및 실행
    const reviewRepository = new SbReviewRepository();
    const reviewUseCases = new ReviewUseCases(reviewRepository);

    const receiverNickname = await reviewUseCases.getReviewReceiverNickname(
      nickname,
      Number(helpId)
    );

    return NextResponse.json({
      receiverNickname,
      message: '리뷰 상대방을 성공적으로 조회했습니다.',
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('리뷰 상대방 조회 중 오류:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '리뷰 상대방 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 