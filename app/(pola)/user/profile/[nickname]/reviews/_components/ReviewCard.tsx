import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ReviewCard.module.css';

interface Review {
  id: number;
  helpId: number;
  writerNickname: string;
  receiverNickname: string;
  rating: number;
  text: string;
  reviewImgUrl?: string;
  writerProfileImgUrl?: string;
  createdAt: string;
}

export default function ReviewCard({ review }: { review: Review }) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/user/profile/${review.writerNickname}`);
  };

  return (
    <li className={styles.reviewItem}>
      <div className={styles.reviewHeaderRow}>
        <Image
          src={review.writerProfileImgUrl || '/images/dummies/dummy_user.png'}
          alt={review.writerNickname}
          width={40}
          height={40}
          className={styles.profileImageCircle}
        />
        <span className={styles.nicknameRow}>
          <span className={styles.nicknameBold}>{review.writerNickname}</span>
          <span
            className={styles.arrow}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            &nbsp;&gt;
          </span>
        </span>
        <span className={styles.stars}>
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </span>
      </div>
      {review.reviewImgUrl && (
        <div className={styles.reviewImageContainer}>
          <Image
            src={review.reviewImgUrl}
            alt={`Review image for review ${review.id}`}
            width={100}
            height={100}
            className={styles.reviewImage}
          />
        </div>
      )}
      <div className={styles.reviewTextBox}>{review.text}</div>
    </li>
  );
} 