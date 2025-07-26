'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyJuniorHelpCompletion } from '@/lib/api_front/help.api';
import styles from './commons/HelpVerificationModal.module.css';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  helpId: number;
  helpTitle: string;
  isCompleted?: boolean;
}

export default function VerificationModal({
  isOpen,
  onClose,
  helpId,
  helpTitle,
  isCompleted = false,
}: VerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'completed'>(
    'input'
  );
  const router = useRouter();

  // isCompleted prop이 변경되면 완료 상태로 변경
  useEffect(() => {
    if (isCompleted) {
      setStep('completed');
    }
  }, [isCompleted]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setIsSubmitting(true);
    setStep('processing');

    try {
      // 인증번호 검증 API 호출
      await verifyJuniorHelpCompletion(helpId, String(verificationCode));
      setStep('completed');
    } catch (error) {
      console.error('인증번호 검증 오류:', error);
      alert('인증번호가 올바르지 않습니다.');
      setStep('input');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewClick = () => {
    router.push(`/helps/${helpId}/create-review`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Help 완료 인증</h2>
        </div>

        <div className={styles.modalBody}>
          {step === 'input' && (
            <>
              <div className={styles.helpInfo}>
                <p>
                  <strong>{helpTitle}</strong>의 인증번호를 입력해주세요.
                </p>
              </div>
              <form onSubmit={handleSubmit} className={styles.verificationForm}>
                <div className={styles.inputGroup}>
                  <input
                    type='text'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder='인증번호 6자리'
                    className={styles.input}
                    maxLength={6}
                    disabled={isSubmitting}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type='submit'
                    disabled={isSubmitting || !verificationCode.trim()}
                    className={styles.submitButton}
                  >
                    {isSubmitting ? '검증 중...' : '인증하기'}
                  </button>
                  <button
                    type='button'
                    onClick={onClose}
                    className={styles.cancelButton}
                  >
                    닫기
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className={styles.processingContent}>
              <div className={styles.loadingSpinner}></div>
              <h3 className={styles.processingTitle}>Help 완료 중입니다...</h3>
              <p className={styles.processingMessage}>잠시만 기다려주세요.</p>
            </div>
          )}

          {step === 'completed' && (
            <div className={styles.completedContent}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.completedTitle}>Help가 완료되었습니다!</h3>
              <p className={styles.completedMessage}>리뷰를 작성해보세요.</p>
              <div className={styles.buttonGroup}>
                <button
                  onClick={handleReviewClick}
                  className={styles.reviewButton}
                >
                  리뷰 작성하기
                </button>
                <button onClick={onClose} className={styles.cancelButton}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
