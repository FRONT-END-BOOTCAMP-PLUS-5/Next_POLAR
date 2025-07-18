'use client';

import { useRef, useEffect } from 'react';

import styles from './ChatRoom.module.css';
import { useChatInput } from '@/lib/hooks/chats/useChatInput';
import { useChatMessages } from '@/lib/hooks/chats/useChatMessages';
import { useSendMessage } from '@/lib/hooks/chats/useSendMessage';
import { useRealtimeChat } from '@/lib/hooks/chats/useRealtimeChat';

interface ChatRoomProps {
  roomId: number;
  loginUserNickname: string;
}

export default function ChatRoom({ roomId, loginUserNickname }: ChatRoomProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 채팅 관련 훅들 사용
  const { data: messagesData, isLoading } = useChatMessages(roomId);
  const { mutate: sendMessageMutate, isPending: isSending } = useSendMessage();

  // 실시간 채팅 구독
  useRealtimeChat({
    roomId,
    onMessageReceived: () => {
      // 새 메시지가 도착하면 스크롤을 맨 아래로
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
  });

  // 채팅 입력 관리
  const {
    message,
    canSend,
    handleInputChange,
    handleSendMessage,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useChatInput({
    onSendMessage: (messageText) => {
      sendMessageMutate({ roomId, message: messageText });
    },
  });

  // 스크롤 최하단
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.messages]);

  // 메시지 데이터 변환
  const messages =
    messagesData?.messages.map((msg) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    })) || [];

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {isLoading ? (
          <div className={styles.loading}>메시지 로딩 중...</div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.nickname === loginUserNickname;
            return (
              <div
                key={msg.id}
                className={isMine ? styles.myMessageRow : styles.messageRow}
              >
                {!isMine && (
                  <div className={styles.avatar}>
                    <div className={styles.avatarIcon}>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <circle cx='12' cy='9' r='4' fill='#b6d4fe' />
                        <ellipse cx='12' cy='17' rx='7' ry='4' fill='#b6d4fe' />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={
                    isMine ? styles.myMessageWrapper : styles.messageWrapper
                  }
                >
                  {isMine ? (
                    <>
                      <div className={styles.myMeta}>
                        <span className={styles.read}>읽음</span>
                        <span>{msg.createdAt.toLocaleTimeString()}</span>
                      </div>
                      <div className={`${styles.bubble} ${styles.myBubble}`}>
                        {msg.message}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.bubble}>{msg.message}</div>
                      <div className={styles.meta}>
                        <span>{msg.createdAt.toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className={styles.inputContainer}>
        <button className={styles.plusBtn} type='button'>
          +
        </button>
        <textarea
          ref={textareaRef}
          className={styles.messageInput}
          rows={1}
          placeholder='메시지 입력'
          value={message}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <button
          className={styles.sendButton}
          disabled={!canSend || isSending}
          onClick={handleSendMessage}
        >
          {isSending ? '전송 중...' : '전송'}
        </button>
      </div>
    </div>
  );
}
