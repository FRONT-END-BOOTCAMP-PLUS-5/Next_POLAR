import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '@/backend/users/withdrawal/applications/usecases/UserWithdrawalUseCase';
import { SbWithdrawalUserRepository } from '@/backend/users/withdrawal/infrastructures/SbUserRepository';
import { WithdrawalRequestDto } from '@/backend/users/withdrawal/applications/dtos/WithdrawalRequestDto';

export async function POST(req: NextRequest) {
  try {

    const { userId, confirmPassword, reason }: WithdrawalRequestDto = await req.json();

    // 비밀번호 확인 로직 (실제 구현에서는 사용자 비밀번호와 비교)
    if (!confirmPassword) {
      return NextResponse.json(
        { success: false, error: '비밀번호 확인이 필요합니다.' },
        { status: 400 }
      );
    }

    // 탈퇴 사유 로그 (선택사항)
    if (reason) {
      console.log(`회원 탈퇴 사유: ${reason}`);
    }
    
    const userRepository = new SbWithdrawalUserRepository();
    const usecase = new UserWithdrawalUseCase(userRepository);
    
    const result = await usecase.execute(userId);
    
    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    // 에러 타입 검증
    if (e instanceof Error) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
      );
    }

    // 예상치 못한 에러 타입
    // console.error('User withdrawal error:', e);
    return NextResponse.json(
      { success: false, error: '회원 탈퇴 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
