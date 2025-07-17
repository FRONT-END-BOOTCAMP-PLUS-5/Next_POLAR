'use client';
import styles from './JuniorMain.module.css';
import ProfileBanner from '@/app/_components/ProfileBanner';
import CategoryGrid from '@/app/_components/CategoryGrid';

export default function JuniorMainPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.back}>{'<'} </span>
        <span className={styles.menu}>☰</span>
      </header>
      <div className={styles.profileBanner}>
        <ProfileBanner />
      </div>
      <CategoryGrid />
      <div className={styles.helpList}>
        {[1, 2].map((item) => (
          <div className={styles.helpCard} key={item}>
            <div className={styles.helpTextWrap}>
              <div className={styles.helpTitle}>
                수해 피해 복구가 필요해요 글자는 여기까지나와요.
                두줄까지만보여요
              </div>
              <div className={styles.helpDate}>
                2025.07.04(금) ~ 2025.07.06(일)
              </div>
              <div className={styles.helpTag}>
                <span>💪 무거워요</span>
              </div>
            </div>
            <div className={styles.helpRight}>
              <img className={styles.helpImg} src='/help-img.jpg' alt='help' />
              <div className={styles.helpPoint}>150,000점</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
