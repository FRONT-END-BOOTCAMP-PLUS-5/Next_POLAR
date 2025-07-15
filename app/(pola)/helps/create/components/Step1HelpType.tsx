'use client';

import React from 'react';
import styles from './Step1HelpType.module.css';

interface Step1HelpTypeProps {
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

const Step1HelpType: React.FC<Step1HelpTypeProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  const helpTypes = [
    {
      id: 'heavy',
      label: '무거워요',
      description: '무거운 짐을 들거나, 젊은 친구가 힘을 써야 해요!',
      icon: '💪',
      iconClass: styles.optionIconHeavy,
    },
    {
      id: 'difficult',
      label: '어려워요',
      description: '나한텐 너무 어려워요. 누가 설명해주세요!',
      icon: '🤔',
      iconClass: styles.optionIconDifficult,
    },
  ];

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>1단계 어떤 도움이 필요하세요?</h2>

      <div className={styles.optionGrid}>
        {helpTypes.map((type) => (
          <div
            key={type.id}
            className={`${styles.optionCard} ${
              selectedType === type.id ? styles.optionCardSelected : ''
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            <div className={styles.optionHeader}>
              <div className={`${styles.optionIcon} ${type.iconClass}`}>
                {type.icon}
              </div>
              <span className={styles.optionLabel}>{type.label}</span>
            </div>
            <p className={styles.optionDescription}>{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1HelpType;
