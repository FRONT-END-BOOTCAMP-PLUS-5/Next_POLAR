import { NextRequest, NextResponse } from 'next/server';
import { SbHelpApplicantRepository } from '@/backend/helps/infrastructures/repositories/SbHelpApplicantRepository';
import { AcceptHelpApplicantUseCase } from '@/backend/helps/applications/usecases/HelpApplicationUseCases';
import { AcceptHelpApplicantResponseDto } from '@/backend/helps/applications/dtos/HelpApplicationDto';
import { getUuidByNickname } from '@/lib/getUserData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: number; juniorNickname: string }> }
) {
  try {
    const { helpId, juniorNickname } = await params;
    if (!helpId)
      return NextResponse.json({ error: 'helpId 필요' }, { status: 400 });
    if (!juniorNickname)
      return NextResponse.json(
        { error: '주니어 닉네임 필요' },
        { status: 400 }
      );

    // 닉네임으로 UUID 조회
    const juniorId = await getUuidByNickname(juniorNickname);
    if (!juniorId) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    const repo = new SbHelpApplicantRepository();
    const usecase = new AcceptHelpApplicantUseCase(repo);
    await usecase.execute(helpId, juniorId);

    // 응답 DTO
    const response: AcceptHelpApplicantResponseDto = {
      success: true,
      message: '지원자를 수락했습니다.',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e: unknown) {
    console.error('헬프 지원자 수락 오류:', e);

    if (e instanceof Error && e.message === '지원자를 찾을 수 없습니다.') {
      return NextResponse.json(
        {
          success: false,
          error: e.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '서버 오류',
      },
      { status: 500 }
    );
  }
}
