import { useQuery } from '@tanstack/react-query';
import { getChatRooms } from '../../api_front/chat.api';
import { QUERY_KEYS } from '../../constants/api';
import { GetChatRoomsResponse } from '../../models/chatDto';

export function useChatRooms() {
  return useQuery<GetChatRoomsResponse>({
    queryKey: QUERY_KEYS.CHAT_ROOMS,
    queryFn: () => getChatRooms(),
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  });
}
