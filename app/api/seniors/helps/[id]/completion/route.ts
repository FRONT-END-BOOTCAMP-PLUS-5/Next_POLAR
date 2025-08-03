import { NextRequest, NextResponse } from 'next/server';
import { SeniorHelpCompletionUseCase } from '@/backend/seniors/helps/applications/usecases/SeniorHelpCompletionUseCase';
import { HelpStatusRepository } from '@/backend/common/repositories/HelpStatusRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

// 시니어 Help 완료 요청 API (인증번호 발급)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
) {
  try {
    const { helpId } = await params;
    const helpIdNum = parseInt(helpId);

    if (isNaN(helpIdNum)) {
      return NextResponse.json(
        { error: '유효하지 않은 Help ID입니다.' },
        { status: 400 }
      );
    }

    // 사용자 인증
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 시니어 Help 완료 요청 유스케이스 실행
    const seniorHelpCompletionUseCase = new SeniorHelpCompletionUseCase(
      new HelpStatusRepository()
    );

    const verificationCode =
      await seniorHelpCompletionUseCase.requestCompletion(helpIdNum);

    // Help 제목 조회 (시니어 모달에서 표시용)
    const { data: helpData } = await fetch(
      `${request.nextUrl.origin}/api/helps/${helpIdNum}`
    ).then((res) => res.json());

    return NextResponse.json({
      success: true,
      verificationCode,
      helpTitle: helpData?.title || 'Help',
      message: '인증번호가 발급되었습니다. 주니어에게 인증번호를 전달해주세요.',
    });
  } catch (error) {
    console.error('시니어 Help 완료 요청 오류:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
