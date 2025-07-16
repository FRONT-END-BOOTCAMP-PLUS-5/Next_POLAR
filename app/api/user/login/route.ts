import { LoginRequestDTO } from '@/backend/auths/login/applications/dtos/LoginRequest';
import { LoginUseCase } from '@/backend/auths/login/applications/usecases/LoginUseCase';
import { LoginRepository } from '@/backend/auths/login/infrastructures/repositories/LoginRepository';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loginId, password } = body;

    if (!loginId || !password) {
      return NextResponse.json(
        { error: '로그인 ID와 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const usecase = new LoginUseCase(new LoginRepository());
    const result = await usecase.execute(
      new LoginRequestDTO(loginId, password)
    );

    const cookieStore = await cookies();
    cookieStore.set('access-token', result.accessToken);
    cookieStore.set('refresh-token', result.refreshToken);

    return NextResponse.json({
      nickname: result.nickname,
      role: result.role,
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : '로그인 처리 중 오류가 발생했습니다.';

    if (errorMessage.includes('로그인 정보가 올바르지 않습니다')) {
      return NextResponse.json(
        { error: '로그인 정보가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    if (
      errorMessage.includes('로그인 ID와 비밀번호를 입력해주세요') ||
      errorMessage.includes('잘못된 입력 형식입니다')
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
