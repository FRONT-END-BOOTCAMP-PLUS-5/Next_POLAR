import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/repositories/ScoreRepository';
import { getNicknameFromCookie } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 쿠키에서 nickname 추출
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};
  const categoryId = Number(req.nextUrl.searchParams.get('categoryId'));

  if (!nickname) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  if (!categoryId) {
    return NextResponse.json(
      { error: 'categoryId가 필요합니다.' },
      { status: 400 }
    );
  }

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { error: '유효하지 않은 categoryId입니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByNicknameAndCategoryId({
      nickname,
      categoryId,
    });
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    console.error('점수 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
