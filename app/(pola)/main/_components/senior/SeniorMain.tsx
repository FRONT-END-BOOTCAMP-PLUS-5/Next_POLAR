'use client';
import { useRouter } from 'next/navigation';
import styles from './SeniorMain.module.css';
import CategoryGrid from '@/app/_components/CategoryGrid';

export default function SeniorMainPage() {
  const router = useRouter();

  const handleQuickStart = () => {
    router.push('/helps/create');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
      </header>
      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={handleQuickStart}>
          빠른 시작 !
        </button>
      </div>
      <div className={styles.guide}>
        필요한 카테고리를 눌러 더 빠르게 시작하세요 !
      </div>
      <CategoryGrid />
    </div>
  );
}
