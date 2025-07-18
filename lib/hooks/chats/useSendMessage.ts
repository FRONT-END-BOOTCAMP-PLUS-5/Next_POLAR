import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../../api_front/chat.api';
import { QUERY_KEYS } from '../../constants/api';
import { CreateMessageResponse } from '../../models/chatDto';

interface SendMessageParams {
  roomId: number;
  message: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<CreateMessageResponse, Error, SendMessageParams>({
    mutationFn: ({ roomId, message }) => sendMessage(roomId, message),

    onSuccess: (_, variables) => {
      // 메시지 전송 성공 시 해당 채팅방의 메시지 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CHAT_MESSAGES(variables.roomId),
      });
    },

    onError: (error) => {
      console.error('메시지 전송 실패:', error);
    },
  });
}
