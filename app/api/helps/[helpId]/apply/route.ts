import { NextRequest, NextResponse } from 'next/server';
import { SbHelpApplicantRepository } from '@/backend/helps/infrastructures/repositories/SbHelpApplicantRepository';
import { ApplyHelpUseCase } from '@/backend/helps/applications/usecases/HelpApplicationUseCases';
import { ApplyHelpResponseDto } from '@/backend/helps/applications/dtos/HelpApplicationDto';
import { getUuidByNickname } from '@/lib/getUserData';
import { getNicknameFromCookie } from '@/lib/jwt';

export async function POST(
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
    const usecase = new ApplyHelpUseCase(repo);
    await usecase.execute(helpId, juniorId);
    // 응답 DTO
    const response: ApplyHelpResponseDto = {
      success: true,
      message: '헬프 지원이 완료되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error('헬프 지원 오류:', error);

    // Error 객체인지 확인
    if (error instanceof Error) {
      if (error.message === '이미 지원한 헬프입니다.') {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 409 }
        );
      }
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
