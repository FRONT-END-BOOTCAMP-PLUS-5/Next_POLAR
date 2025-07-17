import { useEffect, useRef } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants/api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UseRealtimeChatProps {
  roomId: string;
  onMessageReceived?: () => void;
}

export function useRealtimeChat({
  roomId,
  onMessageReceived,
}: UseRealtimeChatProps) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 실시간 메시지 구독
    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages',
          filter: `contact_room_id=eq.${roomId}`,
        },
        async () => {
          // 새 메시지가 도착하면 해당 채팅방의 메시지 캐시 무효화
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CHAT_MESSAGES(roomId),
          });

          // 콜백 함수 호출
          onMessageReceived?.();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId, queryClient, onMessageReceived]);

  return {
    isConnected: !!channelRef.current,
  };
}
