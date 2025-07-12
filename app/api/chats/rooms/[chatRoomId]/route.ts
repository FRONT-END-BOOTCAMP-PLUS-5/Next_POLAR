import { NextRequest, NextResponse } from 'next/server';
import { GetChatRoomDetailUseCase } from '@/backend/chats/chatrooms/applications/usecases/GetChatRoomDetailUseCase';
import { SbChatRoomRepository } from '@/backend/chats/chatrooms/infrastructures/repositories/SbChatRoomRepository';

// GET /api/chats/rooms/[chatRoomId]
export async function GET(req: NextRequest, { params }: { params: Promise<{ chatRoomId: string }> }) {
  const { chatRoomId } = await params;
  const chatRoomIdNum = Number(chatRoomId);
  if (isNaN(chatRoomIdNum)) return NextResponse.json({ error: 'Invalid chatRoomId' }, { status: 400 });

  // 유스케이스 실행
  const usecase = new GetChatRoomDetailUseCase(new SbChatRoomRepository());
  const room = await usecase.execute({ chatRoomId: chatRoomIdNum });

  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // 성공 시 HTTP 상태 코드 콘솔 출력
  console.log('GET /api/chats/rooms/[chatRoomId] - Status: 200 OK');

  // 결과 반환
  return NextResponse.json(room, {status: 200})
} 