import { NextRequest, NextResponse } from 'next/server';
import { UserWithdrawalUseCase } from '../../(backend)/auths/applications/usecases/UserWithdrawalUseCase';
import { SupabaseUserRepository } from '../../(backend)/auths/infrastructures/SupabaseUserRepository';

export async function POST(req: NextRequest) {
  const { userId, type, reason } = await req.json();
  const userRepository = new SupabaseUserRepository();
  const usecase = new UserWithdrawalUseCase(userRepository);
  try {
    await usecase.execute(userId, type, reason);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
} 