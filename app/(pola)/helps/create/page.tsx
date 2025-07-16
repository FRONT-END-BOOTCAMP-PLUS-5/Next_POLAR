'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './createHelp.module.css';
import Step1HelpType from './components/Step1HelpType';
import Step2TimeSelection from './components/Step2TimeSelection';
import Step3HelpDetails from './components/Step3HelpDetails';
import { useCreateHelp } from '@/lib/hooks/useCreateHelp';
import { useImageContext } from '@/lib/contexts/ImageContext';
import { HelpFunnelData } from '@/lib/models/createHelpDto';

type Step = 1 | 2 | 3;

const CreateHelpPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [helpData, setHelpData] = useState<HelpFunnelData>({
    type: null,
    timeType: null,
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    title: '',
    content: '',
    imageFiles: [],
  });
  const { mutateAsync, isPending } = useCreateHelp();
  const { imageFiles, clearImages } = useImageContext();

  const handleTypeSelect = (type: string) => {
    setHelpData((prev) => ({ ...prev, type }));
  };

  const handleTimeTypeSelect = (timeType: string) => {
    setHelpData((prev) => ({ ...prev, timeType }));
  };

  const handleDateChange = (date: string) => {
    setHelpData((prev) => ({ ...prev, date }));
  };

  const handleStartTimeChange = (startTime: string) => {
    setHelpData((prev) => ({ ...prev, startTime }));
  };

  const handleEndTimeChange = (endTime: string) => {
    setHelpData((prev) => ({ ...prev, endTime }));
  };

  const handleTitleChange = (title: string) => {
    setHelpData((prev) => ({ ...prev, title }));
  };

  const handleContentChange = (content: string) => {
    setHelpData((prev) => ({ ...prev, content }));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return helpData.type !== null;
      case 2:
        if (
          helpData.timeType === 'specific' ||
          helpData.timeType === 'tomorrow'
        ) {
          return helpData.date && helpData.startTime && helpData.endTime;
        }
        return helpData.timeType !== null;
      case 3:
        return helpData.title.trim() !== '' && helpData.content.trim() !== '';
      default:
        return false;
    }
  };

  const canGoPrevious = () => {
    return currentStep > 1;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    try {
      // FormData 생성하여 이미지 파일들과 help 데이터를 함께 전송
      const formData = new FormData();

      // help 데이터 추가
      formData.append('title', helpData.title);
      formData.append('content', helpData.content);
      formData.append('category', helpData.type === 'heavy' ? '1' : '2'); // 무거워요: 1, 어려워요: 2
      formData.append(
        'startDate',
        helpData.timeType === 'now'
          ? new Date().toISOString()
          : `${helpData.date}T${helpData.startTime}:00`
      );
      formData.append(
        'endDate',
        helpData.timeType === 'now'
          ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2시간 후
          : `${helpData.date}T${helpData.endTime}:00`
      );

      // 이미지 파일들 추가
      imageFiles.forEach((file) => {
        formData.append(`imageFiles`, file);
      });

      const helpResult = await mutateAsync(formData);
      const createdHelpId = helpResult?.id || null;

      if (!createdHelpId) {
        throw new Error('도움 요청 생성 후 ID를 받지 못했습니다.');
      }

      // 성공 시 이미지 컨텍스트 클리어
      clearImages();

      alert('도움 요청이 성공적으로 생성되었습니다!');
      router.push('/junior');
    } catch (error) {
      console.error('도움 요청 생성 실패:', error);
    }
  };

  const getStepIndicatorClass = (step: number) => {
    if (step < currentStep) return styles.stepCompleted;
    if (step === currentStep) return styles.stepActive;
    return styles.stepInactive;
  };

  const getStepLineClass = (step: number) => {
    if (step < currentStep) return styles.stepLineCompleted;
    if (step === currentStep) return styles.stepLineActive;
    return styles.stepLine;
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1:
        return '다음 단계로!';
      case 2:
        return '다음 단계로!';
      case 3:
        return '도움 생성!';
      default:
        return '다음';
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>도움 요청</h1>
      </div>

      {/* 단계 표시기 */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${getStepIndicatorClass(1)}`}>1</div>
        <div className={`${styles.stepLine} ${getStepLineClass(1)}`}></div>
        <div className={`${styles.step} ${getStepIndicatorClass(2)}`}>2</div>
        <div className={`${styles.stepLine} ${getStepLineClass(2)}`}></div>
        <div className={`${styles.step} ${getStepIndicatorClass(3)}`}>3</div>
      </div>

      {/* 단계별 컨텐츠 */}
      {currentStep === 1 && (
        <Step1HelpType
          selectedType={helpData.type}
          onTypeSelect={handleTypeSelect}
        />
      )}

      {currentStep === 2 && (
        <Step2TimeSelection
          selectedTimeType={helpData.timeType}
          selectedDate={helpData.date}
          selectedStartTime={helpData.startTime}
          selectedEndTime={helpData.endTime}
          onTimeTypeSelect={handleTimeTypeSelect}
          onDateChange={handleDateChange}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
        />
      )}

      {currentStep === 3 && (
        <Step3HelpDetails
          title={helpData.title}
          content={helpData.content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
        />
      )}

      <div className={styles.navigation}>
        <button
          className={`${styles.navButton} ${styles.navButtonSecondary}`}
          onClick={handlePrevious}
          disabled={!canGoPrevious()}
        >
          이전
        </button>

        {currentStep === 3 ? (
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary} ${
              !canGoNext() || isPending ? styles.navButtonDisabled : ''
            }`}
            onClick={handleSubmit}
            disabled={!canGoNext() || isPending}
          >
            {isPending ? '생성 중...' : getButtonText()}
          </button>
        ) : (
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary} ${
              !canGoNext() ? styles.navButtonDisabled : ''
            }`}
            onClick={handleNext}
            disabled={!canGoNext()}
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateHelpPage;
