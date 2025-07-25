'use client';
import apiClient from '@/lib/http.api';
import { API_ENDPOINTS } from '@/lib/constants/api';
import {
  GetMessagesResponse,
  CreateMessageResponse,
  ChatRoomDetailWithHelps,
} from '../models/chatDto';

// 채팅방 상세 정보 타입
export interface ChatRoomWithDetails {
  contactRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
  };
  latestHelp?: {
    id: number;
    title: string;
    category: { id: number; point: number }[];
    representativeImage: string;
    status: string;
  };
}

export interface ChatRoomListWithDetailsResponse {
  rooms: ChatRoomWithDetails[];
  totalCount: number;
}

// 채팅방 접근 권한 확인 응답 인터페이스
export interface ChatRoomAccessResponse {
  hasAccess: boolean;
}

// 채팅방 히스토리 응답 인터페이스
export interface ChatRoomHistoryResponse {
  contactRoomId: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
    address: string;
  };
  reviewStats: {
    averageRating: number;
    reviewCount: number;
  };
  helps: {
    id: number;
    title: string;
    representativeImage: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    category: { id: number; point: number }[];
  }[];
}

// 채팅방 목록 조회 (상세 정보 포함)
export const getChatRoomsWithDetails =
  async (): Promise<ChatRoomListWithDetailsResponse> => {
    const response = await apiClient.get<ChatRoomListWithDetailsResponse>(
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

// 채팅방 히스토리 조회 (통합 API)
export const getChatRoomHistory = async (
  chatRoomId: number
): Promise<ChatRoomHistoryResponse> => {
  const response = await apiClient.get<ChatRoomHistoryResponse>(
    `/api/chats/rooms/${chatRoomId}/history`
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
