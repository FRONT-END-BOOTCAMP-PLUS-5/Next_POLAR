import { NextRequest, NextResponse } from 'next/server';
import { SbHelpApplicantRepository } from '@/backend/helps/infrastructures/repositories/SbHelpApplicantRepository';
import { CheckHelpApplicationStatusUseCase } from '@/backend/helps/applications/usecases/HelpApplicationUseCases';
import { ApplicationStatusResponseDto } from '@/backend/helps/applications/dtos/HelpApplicationDto';
import { getUuidByNickname } from '@/lib/getUserData';
import { getNicknameFromCookie } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: number }> }
) {
  try {
    const { helpId } = await params;
    if (!helpId)
      return NextResponse.json({ error: 'helpId 필요' }, { status: 400 });

    // JWT에서 사용자 닉네임 가져오기
    const userInfo = getNicknameFromCookie(request);

    if (!userInfo) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { nickname: juniorNickname } = userInfo;

    // 닉네임으로 UUID 조회
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const repo = new SbHelpApplicantRepository();
    const usecase = new CheckHelpApplicationStatusUseCase(repo);
    const applicationStatus = await usecase.execute(helpId, juniorId);

    // 응답 DTO
    const response: ApplicationStatusResponseDto = {
      hasApplied: applicationStatus.hasApplied,
      isAccepted: applicationStatus.isAccepted,
      appliedAt: applicationStatus.appliedAt,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e: unknown) {
    console.error('헬프 지원 상태 확인 오류:', e);

    return NextResponse.json(
      {
        error: '서버 오류',
      },
      { status: 500 }
    );
  }
}
