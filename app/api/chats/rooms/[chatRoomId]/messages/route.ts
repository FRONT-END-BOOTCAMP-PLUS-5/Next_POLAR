import { NextRequest, NextResponse } from 'next/server';
import { ContactMessageUseCases } from '@/backend/chats/messages/applications/usecases/ContactMessageUseCases';
import { SbContactMessageRepository } from '@/backend/chats/messages/infrastructures/repositories/SbContactMessageRepository';
// import { ContactReadStatusUseCases } from '@/backend/chats/read_statuses/applications/usecases/ContactReadStatusUseCases';
// import { SbContactReadStatusRepository } from '@/backend/chats/read_statuses/infrastructures/SbContactReadStatusRepository';
import { getUserIdFromCookie } from '@/lib/jwt';

const messageUseCases = new ContactMessageUseCases(
  new SbContactMessageRepository()
);
// const readStatusUseCases = new ContactReadStatusUseCases(new SbContactReadStatusRepository());

// GET /api/chats/rooms/[chatRoomId]/messages
export async function GET(request: NextRequest, { params }: { params: { chatRoomId: string } }) {
  const roomId = Number(params.chatRoomId);

  console.log('[API][GET /api/chats/rooms/[chatRoomId]/messages] 요청 시작:', { roomId });

  if (!roomId) {
    console.warn('[API][GET /api/chats/rooms/[chatRoomId]/messages] chatRoomId 파라미터 누락');
    return NextResponse.json(
      { error: 'chatRoomId 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  // 쿠키에서 사용자 ID 가져오기
  const readerId = getUserIdFromCookie(request);
  if (!readerId) {
    console.warn('[API][GET /api/chats/rooms/[chatRoomId]/messages] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const messages = await messageUseCases.getMessagesByContactRoomId(roomId);
    console.log('[API][GET /api/chats/rooms/[chatRoomId]/messages] 메시지 조회 성공:', {
      roomId,
      count: messages.length,
    });

    return NextResponse.json(
      {
        success: true,
        messages: messages.map((message) => message.toJSON()),
        readStatus: null,
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
export async function POST(request: NextRequest, { params }: { params: { chatRoomId: string } }) {
  console.log('[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 요청 시작');

  // 쿠키에서 사용자 ID 가져오기
  const senderId = getUserIdFromCookie(request);
  if (!senderId) {
    console.warn('[API][POST /api/chats/rooms/[chatRoomId]/messages] 인증되지 않은 사용자');
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const roomId = Number(params.chatRoomId);

  try {
    const { message } = await request.json();

    console.log('[API][POST /api/chats/rooms/[chatRoomId]/messages] 요청 데이터:', {
      message,
      roomId,
      senderId,
    });

    if (!message) {
      console.warn('[API][POST /api/chats/rooms/[chatRoomId]/messages] 필수 값 누락');
      return NextResponse.json(
        { error: '필수 값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    console.log('[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 시작...');
    const created = await messageUseCases.createMessage({
      senderId: senderId,
      contactRoomId: roomId,
      message,
    });

    console.log('[API][POST /api/chats/rooms/[chatRoomId]/messages] 메시지 생성 완료:', {
      messageId: created?.id,
      senderId: created?.senderId,
      contactRoomId: created?.contactRoomId,
      message: created?.message,
      createdAt: created?.createdAt,
    });

    // 메시지 생성 후 읽음 상태 업데이트 (생성된 메시지 ID로) (주석처리)
    // if (created && created.id) {
    //   await readStatusUseCases.updateReadStatus(contactRoomId, senderId, created.id);
    //   console.log('[API][POST /api/chats/messages] 읽음 상태 업데이트 완료:', { messageId: created.id });
    // }

    console.log(
      '[API][POST /api/chats/messages] 메시지 생성 성공 - 실시간 이벤트 발생 예상'
    );
    console.log(
      '[API][POST /api/chats/messages] contact_messages 테이블에 INSERT 이벤트 발생'
    );
    console.log(
      '[API][POST /api/chats/messages] Supabase Realtime이 이 이벤트를 구독자들에게 전송해야 함'
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
