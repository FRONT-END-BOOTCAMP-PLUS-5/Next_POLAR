import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/repositories/SbContactMessageRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

const messageUseCases = new ContactMessageUseCases(
  new SbContactMessageRepository()
);

// GET /api/chats/rooms/[chatRoomId]/messages
export async function GET(
  request: NextRequest,
  { params }: { params: { chatRoomId: string } }
) {
  const { chatRoomId } = await params;
  const roomId = Number(chatRoomId);

  console.log('[API][GET /api/chats/rooms/[chatRoomId]/messages] 요청 시작:', {
    roomId,
  });

  if (!roomId) {
    console.warn(
      '[API][GET /api/chats/rooms/[chatRoomId]/messages] chatRoomId 파라미터 누락'
    );
    return NextResponse.json(
      { error: 'chatRoomId 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  // 쿠키에서 사용자 ID 가져오기
  const userData = getNicknameFromCookie(request);
  const { nickname } = userData || {};

  if (!nickname) {
    console.warn(
      '[API][GET /api/chats/rooms/[chatRoomId]/messages] 인증되지 않은 사용자'
    );
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    // 닉네임 기반으로 메시지 조회 (이미 닉네임이 포함된 응답)
    const result = await messageUseCases.getMessagesByContactRoomId(roomId);

    console.log(
      '[API][GET /api/chats/rooms/[chatRoomId]/messages] 메시지 조회 성공:',
      {
        roomId,
        count: result.messages.length,
      }
    );

    return NextResponse.json(
      {
        success: true,
        messages: result.messages,
        totalCount: result.totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      '[API][GET /api/chats/rooms/[chatRoomId]/messages] 메시지 조회 중 오류 발생:',
      error
    );
    return NextResponse.json(
      { error: '채팅 메시지 조회 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/chats/rooms/[chatRoomId]/messages
export async function POST(
  request: NextRequest,
  { params }: { params: { chatRoomId: string } }
) {
  console.log(
    '[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 요청 시작'
  );

  // 쿠키에서 사용자 ID 가져오기
  const userData = getNicknameFromCookie(request);
  const { nickname: senderNickname } = userData || {};

  const roomId = Number(params.chatRoomId);

  try {
    const { message } = await request.json();

    console.log(
      '[API][POST /api/chats/rooms/[chatRoomId]/messages] 요청 데이터:',
      {
        message,
        roomId,
        senderNickname,
      }
    );

    if (!message) {
      console.warn(
        '[API][POST /api/chats/rooms/[chatRoomId]/messages] 필수 값 누락'
      );
      return NextResponse.json(
        { error: '필수 값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!senderNickname) {
      console.warn(
        '[API][POST /api/chats/rooms/[chatRoomId]/messages] 사용자 닉네임을 찾을 수 없음'
      );
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(
      '[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 시작...'
    );

    // 닉네임 기반으로 메시지 생성
    const created = await messageUseCases.createMessageByNickname(
      senderNickname,
      roomId,
      message
    );

    return NextResponse.json(
      { success: true, message: created },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      '[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 중 오류 발생:',
      error
    );
    return NextResponse.json(
      { error: '메시지 생성 중 오류 발생', detail: String(error) },
      { status: 500 }
    );
  }
}
