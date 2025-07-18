import { useQuery } from '@tanstack/react-query';
import { getChatRoomDetailWithHelps } from '@/lib/api_front/chat.api';
import { ChatRoomDetailWithHelps } from '@/lib/models/chatDto';
import { QUERY_KEYS } from '@/lib/constants/api';

export const useChatRoomDetailWithHelps = (chatRoomId: number) => {
  return useQuery<ChatRoomDetailWithHelps>({
    queryKey: [QUERY_KEYS.CHAT_ROOM_DETAIL(chatRoomId)],
    queryFn: () => getChatRoomDetailWithHelps(chatRoomId),
    enabled: !!chatRoomId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
