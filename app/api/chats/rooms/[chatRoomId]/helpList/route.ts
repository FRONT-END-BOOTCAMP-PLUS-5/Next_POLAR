import { NextRequest, NextResponse } from 'next/server';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';

// ================================
// GET /api/chats/rooms/[chatRoomId]/helpList
// 해당 채팅방(chatRoomId)에 연결된 help_id 리스트를 반환하는 API
// contact_room_helps 테이블에서 room_id 기준으로 help_id 목록 조회
// ================================
export async function GET(req: NextRequest, { params }: { params: { chatRoomId: string } }) {
  // chatRoomId 파라미터를 숫자로 변환
  const chatRoomIdNum = Number(params.chatRoomId);
  if (isNaN(chatRoomIdNum)) {
    // 잘못된 chatRoomId 요청 시 400 반환
    return NextResponse.json({ error: 'Invalid chatRoomId' }, { status: 400 });
  }

  const repo = new SbChatRoomRepository();
  try {
    // contact_room_helps 테이블에서 help_id 리스트 조회
    const helpIds = await repo.findHelpIdsByChatRoomId(chatRoomIdNum);
    // help_id 배열 반환, 성공 시 200 반환
    return NextResponse.json({ helpIds }, { status: 200 });
  } catch (error) {
    // DB 조회 실패 등 에러 발생 시 500 반환
    return NextResponse.json({ error: 'Failed to fetch help list', detail: String(error) }, { status: 500 });
  }
}
