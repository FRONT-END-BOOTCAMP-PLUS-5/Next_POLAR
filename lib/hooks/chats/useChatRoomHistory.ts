import { useQuery } from '@tanstack/react-query';
import { getChatRoomHistory } from '@/lib/api_front/chat.api';
import { QUERY_KEYS } from '@/lib/constants/api';

export const useChatRoomHistory = (chatRoomId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CHAT_ROOM_DETAIL(chatRoomId), 'history'],
    queryFn: () => getChatRoomHistory(chatRoomId),
    enabled: !!chatRoomId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
