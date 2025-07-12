import { NextRequest, NextResponse } from 'next/server';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { entityToUserProfileResponseDto } from '@/backend/users/user/infrastructures/mappers/UserMapper';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = Number(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json({ error: '잘못된 userId입니다.' }, { status: 400 });
    }
    const useCase = new CommonUserUseCase(new SbUserRepository());
    const user = await useCase.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }
    const userDto = entityToUserProfileResponseDto(user);
    return NextResponse.json(userDto, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '유저 조회 중 오류 발생', detail: String(error) }, { status: 500 });
  }
} 