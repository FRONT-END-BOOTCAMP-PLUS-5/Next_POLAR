'use client';
import React from 'react';
import styles from './Step3HelpDetails.module.css';
import ImageUploader from '../../../../_components/commons/imageUploader/ImageUploader';

interface Step3HelpDetailsProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const Step3HelpDetails: React.FC<Step3HelpDetailsProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}) => {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>
        3단계 도움받고 싶은 내용을 입력해주세요
      </h2>

      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>도움 제목</label>
          <input
            type='text'
            className={`${styles.textInput}`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder='요청 제목을 입력해주세요.'
            maxLength={50}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>도움 내용</label>
          <textarea
            className={`${styles.textInput} ${styles.textArea}`}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder='도움이 필요한 시간, 장소, 이유를 자유롭게 적어주세요.'
            maxLength={500}
          />
          <div
            style={{
              textAlign: 'right',
              fontSize: '12px',
              color: '#666',
              marginTop: '4px',
            }}
          >
            {content.length}/500
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>첨부할 이미지</label>
          <ImageUploader maxFiles={5} maxFileSize={5} />
        </div>
      </div>
    </div>
  );
};

export default Step3HelpDetails;
