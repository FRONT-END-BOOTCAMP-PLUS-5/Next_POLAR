import styles from './TopBar.module.css';

interface TopBarProps {
  onClose?: () => void;
  onHeart?: () => void;
}

export default function TopBar({ onClose, onHeart }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>POLAR</div>
      <div className={styles.topButtons}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <button className={styles.heartButton} onClick={onHeart}>♡</button>
      </div>
    </div>
  );
} 