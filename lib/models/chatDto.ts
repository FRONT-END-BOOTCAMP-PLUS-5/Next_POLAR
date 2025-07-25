import { HelpDetail } from './helpDetail';

export interface ChatMessage {
  id: number | string;
  nickname: string;
  contactRoomId: number;
  message: string;
  createdAt: string;
}

export interface ChatRoom {
  chatRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
  totalCount: number;
}

export interface GetChatRoomsResponse {
  rooms: ChatRoom[];
  totalCount: number;
}

export interface CreateMessageRequest {
  message: string;
}

export interface CreateMessageResponse {
  success: boolean;
  message: ChatMessage;
}

export interface ChatRoomDetailWithHelps {
  chatRoomId: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  helps: HelpDetail[];
}
