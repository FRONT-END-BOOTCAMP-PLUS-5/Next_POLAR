import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomWithHelpsUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomWithHelpsUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatRoomId: string }> }
): Promise<NextResponse> {
  try {
    const { chatRoomId } = await params;
    const roomId = parseInt(chatRoomId);

    if (isNaN(roomId)) {
      return NextResponse.json(
        { error: '유효하지 않은 채팅방 ID입니다.' },
        { status: 400 }
      );
    }

    // UseCase 실행
    const chatRoomRepository = new SbChatRoomRepository();
    const helpRepository = new SbCommonHelpRepository();
    const helpImageRepository = new SbHelpImageRepository();

    const getChatRoomWithHelpsUseCase = new GetChatRoomWithHelpsUseCase(
      chatRoomRepository,
      helpRepository,
      helpImageRepository
    );

    const result = await getChatRoomWithHelpsUseCase.execute(roomId);

    if (!result) {
      console.log(`API] 채팅방 ${roomId}을 찾을 수 없습니다.`);
      return NextResponse.json(
        { error: '채팅방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(
      `API] 채팅방 ${roomId} 상세 정보 조회 성공 - helps 개수: ${result.helps.length}`
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[API] 채팅방 상세 정보 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
