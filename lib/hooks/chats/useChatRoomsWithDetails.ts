import { useQuery } from '@tanstack/react-query';
import { getChatRoomsWithDetails } from '../../api_front/chat.api';
import { QUERY_KEYS } from '../../constants/api';
import { ChatRoomListWithDetailsResponse } from '../../api_front/chat.api';

export function useChatRoomsWithDetails() {
  return useQuery<ChatRoomListWithDetailsResponse>({
    queryKey: QUERY_KEYS.CHAT_ROOMS,
    queryFn: () => getChatRoomsWithDetails(),
    staleTime: 30 * 1000, // 30초
    gcTime: 5 * 60 * 1000, // 5분
  });
}
