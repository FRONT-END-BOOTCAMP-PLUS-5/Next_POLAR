import { NextRequest, NextResponse } from 'next/server';
import { CheckContactRoomAccessUseCase } from '@/backend/chats/contactRooms/applications/usecases/CheckContactRoomAccessUseCase';
import { SbContactRoomRepository } from '@/backend/chats/contactRooms/infrastructures/repositories/SbContactRoomRepository';

export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 nickname과 roomId 가져오기
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');
    const chatRoomId = parseInt(searchParams.get('chatRoomId') || '0');

    if (!nickname) {
      return NextResponse.json(
        { error: 'Nickname is required' },
        { status: 400 }
      );
    }

    if (isNaN(chatRoomId)) {
      return NextResponse.json(
        { error: 'Invalid chat room ID' },
        { status: 400 }
      );
    }

    const contactRoomRepo = new SbContactRoomRepository();
    const useCase = new CheckContactRoomAccessUseCase(contactRoomRepo);

    const hasAccess = await useCase.execute(nickname, chatRoomId);

    return NextResponse.json({ hasAccess }, { status: 200 });
  } catch (error) {
    console.error('Chat room access check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
