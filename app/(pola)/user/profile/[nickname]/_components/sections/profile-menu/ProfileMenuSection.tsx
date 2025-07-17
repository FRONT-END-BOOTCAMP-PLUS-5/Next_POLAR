"use client";
import Link from "next/link";
import styles from "./profileMenu.module.css";

interface ProfileMenuSectionProps {
  nickname: string;
  onLogout?: () => void;
}

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({
  nickname,
  onLogout,
}) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // TODO: 로그아웃 로직 구현
    console.log("로그아웃 핸들러 호출됨");
  };

  return (
    <section className={styles.profileMenuSection}>
      <div className={styles.profileMenuContainer}>
        <Link
          href={`/user/profile/${nickname}/settings`}
          className={styles.settingsLink}
        >
          <div className={styles.menuItem}>
            <span className={styles.menuIcon}>⚙️</span>
            <span className={styles.menuText}>설정</span>
            <span className={styles.menuArrow}>›</span>
          </div>
        </Link>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.menuIcon}>🚪</span>
          <span className={styles.menuText}>로그아웃</span>
        </button>
      </div>
    </section>
  );
};

export default ProfileMenuSection;
