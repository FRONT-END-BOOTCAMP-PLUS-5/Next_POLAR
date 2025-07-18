'use client';

import { useState, useEffect } from 'react';
import { useChatRoomDetailWithHelps } from '@/lib/hooks';
import styles from './History.module.css';
import Image from 'next/image';
import { formatDateRange } from '@/lib/utils/dateFormat';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatHistoryPage({ params }: PageProps) {
  const [roomId, setRoomId] = useState<number>(0);
  const { data } = useChatRoomDetailWithHelps(roomId);

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </header>
      <div className={styles.topBar}>
        <span className={styles.back}>{'<'} </span>
        <span className={styles.title}>이전 help 기록</span>
      </div>
      <div className={styles.profileBox}>
        <div className={styles.profileImg}></div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{data?.seniorNickname}</div>
          <div className={styles.profileRating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingNum}>(31개)</span>
          </div>
        </div>
      </div>
      <div className={styles.helpList}>
        {helps.map((help) => (
          <div className={styles.helpCard} key={help.id}>
            <div className={styles.helpTextWrap}>
              <div className={styles.helpTitle}>{help.title}</div>
              <div className={styles.helpDate}>
                {formatDateRange(help.startDate, help.endDate)}
              </div>
              <div className={styles.helpTag}>
                {/* <span>{help.category}</span> */}
              </div>
            </div>
            <div className={styles.helpRight}>
              <Image
                className={styles.helpImg}
                src={help.representativeImage || '/help-img.jpg'}
                alt='help'
                width={64}
                height={64}
              />
              {/* <div className={styles.helpPoint}>{help.status}점</div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
