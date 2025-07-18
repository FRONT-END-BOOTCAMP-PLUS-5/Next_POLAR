'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HelpInfo.module.css';
import { HelpDetail } from '@/lib/models/helpDetail';

interface HelpInfoProps {
  roomId: number;
  helpData: HelpDetail;
}

export default function HelpInfo({ roomId, helpData }: HelpInfoProps) {
  const router = useRouter();

  const handlePrevHelpClick = () => {
    router.push(`/chats/${roomId}/history`);
  };

  const getCategoryName = (categoryId: number) => {
    const categories: { [key: number]: string } = {
      1: '💪 무거워요',
      2: '🧹 청소',
      3: '🛠️ 수리',
      4: '📚 학습',
      5: '🏥 돌봄',
    };
    return categories[categoryId] || '기타';
  };

  return (
    <div className={styles.helpInfo}>
      <Image
        className={styles.helpImg}
        src={
          helpData.representativeImage &&
          helpData.representativeImage.length > 0
            ? helpData.representativeImage
            : '/help-img.jpg'
        }
        alt='help'
        width={64}
        height={64}
      />
      <div className={styles.helpTextWrap}>
        <h3 className={styles.helpTitle}>{helpData.title}</h3>
        <div className={styles.tags}>
          <span className={styles.tag}>{getCategoryName(1)}</span>
        </div>
      </div>
      <span className={styles.prevHelp} onClick={handlePrevHelpClick}>
        이전 help 보기 {'>'}
      </span>
    </div>
  );
}
