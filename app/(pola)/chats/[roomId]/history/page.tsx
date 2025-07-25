'use client';

import { useState, useEffect } from 'react';
import styles from './History.module.css';
import Image from 'next/image';
import DummyUser from '@/public/images/dummies/dummy_user.png';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import type { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import Link from 'next/link';
import { useChatRoomHistory } from '@/lib/hooks/chats';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatHistoryPage({ params }: PageProps) {
  const [roomId, setRoomId] = useState<number>(0);
  const { data } = useChatRoomHistory(roomId);

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

  const helps = data?.helps || [];

  // ConnectedHelpDto를 HelpListResponseDto로 변환
  const convertedHelps: HelpListResponseDto[] = helps.map((help) => ({
    id: help.id,
    seniorInfo: {
      nickname: data?.opponentProfile.nickname || '',
      name: data?.opponentProfile.name || data?.opponentProfile.nickname || '',
      userRole: 'senior' as const,
      profileImgUrl: data?.opponentProfile.profileImgUrl || '',
      address: data?.opponentProfile.address || '',
    },
    title: help.title,
    startDate: help.startDate,
    endDate: help.endDate,
    category: help.category,
    content: '', // 채팅방 히스토리에서는 content가 없으므로 빈 문자열
    status: 'completed', // 채팅방 히스토리는 완료된 help들
    createdAt: help.createdAt,
    images: help.representativeImage ? [help.representativeImage] : [],
  }));

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <span className={styles.title}>이전 help 기록</span>
      </div>
      <div className={styles.profileBox}>
        <Link href={`/user/profile/${data?.opponentProfile.nickname}`}>
          <div className={styles.profileImg}>
            <Image
              src={data?.opponentProfile.profileImgUrl || DummyUser}
              alt='Profile'
              width={64}
              height={64}
              className={styles.profileImage}
            />
          </div>
        </Link>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>
            {data?.opponentProfile.nickname}
          </div>
          <div className={styles.profileRating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.round(data?.reviewStats.averageRating || 0))}
              {'☆'.repeat(5 - Math.round(data?.reviewStats.averageRating || 0))}
            </span>
            <span className={styles.ratingNum}>
              ({data?.reviewStats.reviewCount || 0}개)
            </span>
          </div>
        </div>
      </div>
      <div className={styles.helpList}>
        {convertedHelps.map((help) => (
          <HelpListCard key={help.id} help={help} />
        ))}
      </div>
    </div>
  );
}
