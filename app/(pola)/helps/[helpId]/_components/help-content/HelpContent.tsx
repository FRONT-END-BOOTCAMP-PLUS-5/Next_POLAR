import Image from 'next/image';
import styles from './HelpContent.module.css';
import { HelpDetailResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
  rating?: number;
  job?: string;
  jobIcon?: string;
}

interface HelpContentProps {
  help: HelpDetailResponseDto | null;
}

export default function HelpContent({ help }: HelpContentProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!help) return null;

  return (
    <div className={styles.mainContent}>
      <div className={styles.titleAndStatus}>
        <h1 className={styles.helpTitle}>{help.title}</h1>
        <div className={styles.helpStatus}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>상태</span>
            <span className={styles.statusValue}>{help.status}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>지원자</span>
            <span className={styles.statusValue}>3명</span>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      {help.category && help.category.length > 0 && (
        <div className={styles.helpCategories}>
          {help.category.map((cat, index) => (
            <span key={index} className={styles.categoryTag}>
              {cat.id}
            </span>
          ))}
        </div>
      )}

      {/* Help Period */}
      <div className={styles.helpPeriod}>
        {`${formatDate(help.startDate)} ~ ${formatDate(help.endDate)}`}
      </div>

      {/* Help Content */}
      <div className={styles.helpContent}>{help.content}</div>
    </div>
  );
} 