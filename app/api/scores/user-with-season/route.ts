import { GetUserScoresUseCase } from '@/backend/juniors/scores/applications/usecases/ScoreUseCases';
import { ScoreRepository } from '@/backend/juniors/scores/infrastructures/repositories/ScoreRepository';
import { extractNicknameForScoreAccess } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 공통 함수로 nickname 추출 및 권한 검증
  const result = extractNicknameForScoreAccess(req);

  if (result.error) {
    const status = result.isOwnData ? 401 : 403;
    return NextResponse.json({ error: result.error }, { status });
  }

  // season 파라미터 검증
  const season = Number(req.nextUrl.searchParams.get('season'));
  if (!season || isNaN(season)) {
    return NextResponse.json(
      { error: '유효한 season이 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const scoreUseCase = new GetUserScoresUseCase(new ScoreRepository());
    const scores = await scoreUseCase.executeByNicknameAndSeason({
      nickname: result.nickname,
      season,
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
