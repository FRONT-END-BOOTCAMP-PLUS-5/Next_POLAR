import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// POST /api/reviews/create
export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 nickname 추출
    const userData = getNicknameFromCookie(request);
    const { nickname: writerNickname } = userData || {};
    if (!writerNickname) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { helpId, rating, text, reviewImgUrl } = body;

    if (helpId === undefined || rating === undefined || text === undefined) {
      return NextResponse.json(
        { error: '필수 값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // usecase를 통해 리뷰 생성 (receiverId는 자동 계산)
    const review = await reviewUseCases.createReview({
      helpId: Number(helpId),
      writerNickname: writerNickname,
      rating: Number(rating),
      text: String(text),
      reviewImgUrl: reviewImgUrl || undefined,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: unknown) {
    console.error('[API] 리뷰 생성 중 오류 발생:', error);

    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[API] Error 인스턴스 - message:', error.message);

      // 에러 메시지에 따라 구체적인 사유 분류
      let errorReason = '알 수 없는 오류';
      let statusCode = 500;

      if (
        error.message.includes('Help ID') &&
        error.message.includes('찾을 수 없습니다')
      ) {
        errorReason = '존재하지 않는 도움 요청입니다.';
        statusCode = 404;
      } else if (error.message.includes('수락되지 않았습니다')) {
        errorReason = '아직 수락되지 않은 도움 요청입니다.';
        statusCode = 400;
      } else if (error.message.includes('신청 정보가 없습니다')) {
        errorReason = '해당 도움 요청에 신청하지 않았습니다.';
        statusCode = 400;
      } else if (error.message.includes('수락된 주니어가 없습니다')) {
        errorReason = '아직 주니어가 수락되지 않았습니다.';
        statusCode = 400;
      } else if (error.message.includes('조회 중 오류가 발생했습니다')) {
        errorReason = '데이터베이스 조회 중 오류가 발생했습니다.';
        statusCode = 500;
      } else if (
        error.message.includes('닉네임') &&
        error.message.includes('찾을 수 없습니다')
      ) {
        errorReason = '사용자 정보를 찾을 수 없습니다.';
        statusCode = 404;
      }

      return NextResponse.json(
        {
          error: '리뷰 생성 중 오류 발생',
          detail: error.message,
          reason: errorReason,
        },
        { status: statusCode }
      );
    } else {
      console.error('[API] 알 수 없는 에러 타입:', error);
      return NextResponse.json(
        {
          error: '리뷰 생성 중 오류 발생',
          detail: String(error),
          reason: '알 수 없는 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    }
  }
}
