import Image from 'next/image';
import styles from './ProfileSummary.module.css';

export interface UserProfile {
  nickname: string;
  name?: string;
  profileImgUrl?: string;
}

export default function ProfileSummary({ user }: { user: UserProfile }) {
  return (
    <div className={styles.profileSummary}>
      <Image
        src={user.profileImgUrl || '/images/dummies/dummy_user.png'}
        alt={user.nickname}
        width={80}
        height={80}
        className={styles.profileImageLarge}
      />
      <div className={styles.profileInfoBox}>
        <div className={styles.profileNickname}>
          {user.name} <span style={{ color: '#888', fontSize: '15px' }}>({user.nickname})</span>
        </div>
      </div>
    </div>
  );
} 