import { NextRequest, NextResponse } from 'next/server';
import { JuniorHelpCompletionUseCase } from '@/backend/juniors/helps/applications/usecases/JuniorHelpCompletionUseCase';
import { HelpStatusRepository } from '@/backend/common/repositories/HelpStatusRepository';
import { JuniorHelpStatusInfrastructure } from '@/backend/juniors/helps/infrastructures/repositories/JuniorHelpStatusInfrastructure';
import { JuniorsHelpCompletionDto } from '@/backend/juniors/helps/applications/dtos/JuniorsHelpCompletionDto';

// 주니어 Help 완료 처리 API
const juniorHelpCompletionUseCase = new JuniorHelpCompletionUseCase(
  new HelpStatusRepository(),
  new JuniorHelpStatusInfrastructure()
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const helpId = parseInt(id);
    if (isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효하지 않은 Help ID입니다.' },
        { status: 400 }
      );
    }

    const { verificationCode } = await request.json();

    if (!verificationCode) {
      return NextResponse.json(
        { error: '인증 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 주니어: 인증 코드 입력 및 완료 처리
    const result = await juniorHelpCompletionUseCase.completeHelp(
      new JuniorsHelpCompletionDto(helpId, verificationCode)
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('주니어 Help 완료 처리 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}

// 주니어: 인증 코드 유효성 미리 확인 (UI에서 사용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const helpId = parseInt(id);
    if (isNaN(helpId)) {
      return NextResponse.json(
        { error: '유효하지 않은 Help ID입니다.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const verificationCode = searchParams.get('code');

    if (!verificationCode) {
      return NextResponse.json(
        { error: '인증 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    const isValid = await juniorHelpCompletionUseCase.validateCode(
      helpId,
      Number(verificationCode)
    );

    return NextResponse.json({
      isValid,
      message: isValid
        ? '유효한 인증 코드입니다.'
        : '유효하지 않은 인증 코드입니다.',
    });
  } catch (error) {
    console.error('주니어 인증 코드 검증 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
