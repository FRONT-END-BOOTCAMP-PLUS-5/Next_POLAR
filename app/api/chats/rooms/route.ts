import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomsUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

// GET /api/chats/rooms
export async function GET(req: NextRequest) {
  const userId = getUserIdFromCookie(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const usecase = new GetChatRoomsUseCase(new SbChatRoomRepository());
    const rooms = await usecase.execute({ userId });
    return NextResponse.json({ message: '채팅방 리스트 조회 성공', rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: '채팅방 리스트 조회 실패', error: String(error) },
      { status: 500 }
    );
  }
} 