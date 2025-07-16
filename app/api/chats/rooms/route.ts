import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

// GET /api/chats/rooms
export async function GET(req: NextRequest) {
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};

  if (!nickname)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const usecase = new GetChatRoomsUseCase(new SbChatRoomRepository());
    const result = await usecase.execute(nickname);

    return NextResponse.json(
      {
        message: '채팅방 리스트 조회 성공',
        rooms: result.rooms,
        totalCount: result.totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: '채팅방 리스트 조회 실패', error: String(error) },
      { status: 500 }
    );
  }
}
