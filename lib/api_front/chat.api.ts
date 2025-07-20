'use client';
import apiClient from '../http.api';
import { API_ENDPOINTS } from '../constants/api';
import {
  CreateMessageResponse,
  GetChatRoomsResponse,
  GetMessagesResponse,
  ChatRoomDetailWithHelps,
} from '../models/chatDto';

// 채팅방 접근 권한 확인 응답 인터페이스
export interface ChatRoomAccessResponse {
  hasAccess: boolean;
}

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<GetChatRoomsResponse> => {
  const response = await apiClient.get<GetChatRoomsResponse>(
    API_ENDPOINTS.CHAT_ROOMS
  );
  return response.data;
};

// 채팅방 메시지 조회
export const getChatMessages = async (
  roomId: number
): Promise<GetMessagesResponse> => {
  const response = await apiClient.get<GetMessagesResponse>(
    API_ENDPOINTS.CHAT_ROOM_MESSAGES(roomId)
  );
  return response.data;
};

// 메시지 전송
export const sendMessage = async (
  roomId: number,
  message: string
): Promise<CreateMessageResponse> => {
  const response = await apiClient.post<CreateMessageResponse>(
    API_ENDPOINTS.CHAT_ROOM_MESSAGES(roomId),
    { message }
  );
  return response.data;
};

// 채팅방 상세 정보와 연결된 helps 리스트 조회
export const getChatRoomDetailWithHelps = async (
  chatRoomId: number
): Promise<ChatRoomDetailWithHelps> => {
  const response = await apiClient.get<ChatRoomDetailWithHelps>(
    API_ENDPOINTS.CHAT_ROOM_DETAIL(chatRoomId)
  );

  return response.data;
};

// 채팅방 접근 권한 확인


// // 채팅방 접근 권한 확인 에러 응답 인터페이스
// export interface ChatRoomAccessErrorResponse {
//   error: string;
// }

export const checkChatRoomAccess = async (
  nickname: string,
  chatRoomId: number
): Promise<ChatRoomAccessResponse> => {
  const response = await apiClient.get<ChatRoomAccessResponse>(
    `${API_ENDPOINTS.CHAT_ROOM_AUTH_CHECK}?nickname=${nickname}&chatRoomId=${chatRoomId}`
  );
  return response.data;
};
