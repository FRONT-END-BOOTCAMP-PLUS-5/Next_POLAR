'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from './ChatRoom';
import HelpInfo from './_components/HelpInfo';
import styles from './page.module.css';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';
import { useChatRoomDetailWithHelps } from '@/lib/hooks';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const [roomId, setRoomId] = useState<number>(0);
  const { user } = useAuthStore();
  const {
    data: chatRoomWithHelps,
    isLoading,
    error: queryError,
  } = useChatRoomDetailWithHelps(Number(roomId));

  const helpData = chatRoomWithHelps?.helps?.[0] || null;
  const loading = isLoading;
  const error = queryError ? 'Help 정보를 불러오는데 실패했습니다.' : null;

  const nickname = user?.nickname;
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { roomId } = await params;
        setRoomId(Number(roomId));
      } catch {
        // 에러 무시
      }
    };
    initializePage();
  }, [params]);

  if (loading) {
    return (
      <div className={styles.helpInfo}>
        <div className={styles.helpImg}></div>
        <div className={styles.helpTextWrap}>
          <div className={styles.helpTitle}>로딩 중...</div>
          <div className={styles.tags}>
            <span className={styles.tag}>로딩</span>
          </div>
        </div>
        <span className={styles.prevHelp}>이전 help 보기 {'>'}</span>
      </div>
    );
  }

  if (error || !helpData) {
    return (
      <div className={styles.helpInfo}>
        <div className={styles.helpImg}></div>
        <div className={styles.helpTextWrap}>
          <div className={styles.helpTitle}>연결된 help가 없습니다</div>
          <div className={styles.tags}>
            <span className={styles.tag}>없음</span>
          </div>
        </div>
        <Link href={`/chats/${roomId}/history`} className={styles.prevHelp}>
          이전 help 보기 {'>'}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </div>
      <div className={styles.topBar}>
        <span className={styles.back} onClick={() => router.back()}>
          {'<'}
        </span>
        <span className={styles.seniorName}>
          {chatRoomWithHelps?.seniorNickname}
        </span>
      </div>
      {/* 헬프 정보 */}
      {roomId && <HelpInfo roomId={roomId} helpData={helpData} />}
      {/* 채팅 내역/입력창은 ChatRoom에서 분리 구현 */}
      {roomId && nickname && (
        <ChatRoom roomId={roomId} loginUserNickname={nickname} />
      )}
    </div>
  );
}
