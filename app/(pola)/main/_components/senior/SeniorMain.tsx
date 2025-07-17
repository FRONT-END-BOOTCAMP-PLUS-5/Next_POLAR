'use client';
import styles from './SeniorMain.module.css';
import CategoryGrid from '@/app/_components/CategoryGrid';

export default function SeniorMainPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
      </header>
      <div className={styles.buttonRow}>
        <button className={styles.button}>시작하기 !</button>
        <button className={styles.button}>빠른 시작 !</button>
      </div>
      <div className={styles.guide}>
        필요한 카테고리를 눌러 더 빠르게 시작하세요 !
      </div>
      <CategoryGrid />
      <div className={styles.moreGuide}>
        카테고리를 더 보시려면 “더보기”를 눌러주세요.
      </div>
    </div>
  );
}
