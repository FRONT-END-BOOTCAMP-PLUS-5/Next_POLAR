import apiClient from '../http.api';
import { API_ENDPOINTS } from '../constants/api';
import {
  CreateMessageResponse,
  GetChatRoomsResponse,
  GetMessagesResponse,
} from '../models/chatDto';

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<GetChatRoomsResponse> => {
  const response = await apiClient.get<GetChatRoomsResponse>(
    API_ENDPOINTS.CHAT_ROOMS
  );
  return response.data;
};

// 채팅방 메시지 조회
export const getChatMessages = async (
  roomId: string
): Promise<GetMessagesResponse> => {
  const response = await apiClient.get<GetMessagesResponse>(
    API_ENDPOINTS.CHAT_ROOM_MESSAGES(roomId)
  );
  return response.data;
};

// 메시지 전송
export const sendMessage = async (
  roomId: string,
  message: string
): Promise<CreateMessageResponse> => {
  const response = await apiClient.post<CreateMessageResponse>(
    API_ENDPOINTS.CHAT_ROOM_MESSAGES(roomId),
    { message }
  );
  return response.data;
};
