import { useQuery } from '@tanstack/react-query';
import { getChatMessages } from '../../api_front/chat.api';
import { QUERY_KEYS } from '../../constants/api';
import { GetMessagesResponse } from '../../models/chatDto';

export function useChatMessages(roomId: string) {
  return useQuery<GetMessagesResponse>({
    queryKey: QUERY_KEYS.CHAT_MESSAGES(roomId),
    queryFn: () => getChatMessages(roomId),
    enabled: !!roomId,
    staleTime: 10 * 1000, // 10초
    gcTime: 2 * 60 * 1000, // 2분
  });
}
