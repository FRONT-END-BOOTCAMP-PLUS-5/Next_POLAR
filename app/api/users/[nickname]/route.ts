import { NextRequest, NextResponse } from 'next/server';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { entityToUserProfileResponseDto } from '@/backend/common/mappers/UserMapper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json({ error: 'nickname이 필요합니다.' }, { status: 400 });
    }

    const useCase = new CommonUserUseCase(new SbUserRepository());
    const user = await useCase.getUserByNickname(nickname);

    if (!user) {
      return NextResponse.json({ error: '사용자를 sed찾을 수 없습니다.' }, { status: 404 });
    }

    const userDto = entityToUserProfileResponseDto(user);
    return NextResponse.json(userDto, { status: 200 });
  } catch (error) {
    console.error('[API] 사용자 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '사용자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 