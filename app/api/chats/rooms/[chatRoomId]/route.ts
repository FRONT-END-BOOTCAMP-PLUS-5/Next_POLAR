import { NextRequest, NextResponse } from 'next/server';
import { GetContactRoomDetailUseCase } from '@/backend/chats/contactRooms/applications/usecases/GetContactRoomDetailUseCase';
import { SbContactRoomRepository } from '@/backend/chats/contactRooms/infrastructures/repositories/SbContactRoomRepository';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { getNicknameFromCookie } from '@/lib/jwt';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatRoomId: string }> }
): Promise<NextResponse> {
  try {
    const { chatRoomId } = await params;
    const roomId = parseInt(chatRoomId, 10);

    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: '유효하지 않은 채팅방 ID입니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 정보 가져오기 (쿠키에서)
    const { nickname } = getNicknameFromCookie(request) || {};
    if (!nickname) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // UseCase 실행
    const contactRoomRepository = new SbContactRoomRepository();
    const helpRepository = new SbCommonHelpRepository();
    const helpImageRepository = new SbHelpImageRepository();
    const userRepository = new SbUserRepository();

    const getContactRoomDetailUseCase = new GetContactRoomDetailUseCase(
      contactRoomRepository,
      helpRepository,
      helpImageRepository,
      userRepository
    );

    const result = await getContactRoomDetailUseCase.execute(roomId, nickname);

    if (!result) {
      return NextResponse.json(
        { error: '채팅방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('채팅방 상세 조회 중 오류:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '채팅방 상세 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
