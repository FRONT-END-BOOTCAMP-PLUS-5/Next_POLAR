import styles from './ActionButtons.module.css';
import { HelpDetailResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';

interface ActionButtonsProps {
  help: HelpDetailResponseDto | null;
  role: 'junior' | 'senior' | null;
  isCompleting: boolean;
  onCompleteHelp: () => void;
  onApplyHelp: () => void;
  onCheckApplicants: () => void;
}

export default function ActionButtons({
  help,
  role,
  isCompleting,
  onCompleteHelp,
  onApplyHelp,
  onCheckApplicants,
}: ActionButtonsProps) {
  return (
    <div className={styles.bottomButtonContainer}>
      {role === 'junior' ? (
        <button className={styles.applyButton} onClick={onApplyHelp}>
          <span className={styles.plusIcon}>+</span>
          헬프 지원하기
        </button>
      ) : role === 'senior' ? (
        <div className={styles.seniorButtons}>
          <button className={styles.applyButton} onClick={onCheckApplicants}>
            <span className={styles.checkIcon}>👥</span>
            지원자 확인하기
          </button>
          {help?.status === 'connecting' && (
            <button
              className={`${styles.completeButton} ${
                isCompleting ? styles.loading : ''
              }`}
              onClick={onCompleteHelp}
              disabled={isCompleting}
            >
              {isCompleting ? '처리 중...' : 'Help 완료 하기'}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
} 