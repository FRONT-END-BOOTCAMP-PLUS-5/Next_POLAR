'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useSeniorHelpCompletion } from '@/lib/hooks/useSeniorHelpCompletion';
import { useAuthStore } from '@/lib/stores/authStore';
import { useHelpDetail } from '@/lib/hooks/help/useHelpDetail';
import TopBar from './_components/top-bar/TopBar';
import ImageCarousel from './_components/image-carousel/ImageCarousel';
import HelpContent from './_components/help-content/HelpContent';
import ActionButtons from './_components/action-buttons/ActionButtons';
import UserInfoSection from '@/app/_components/commons/common-sections/user-info/UserInfoSection';
import styles from './HelpDetail.module.css';

export default function HelpDetailPage({
  params,
}: {
  params: Promise<{ helpId: string }>;
}) {
  const { helpId } = use(params);

  // React Query를 사용하여 헬프 데이터 가져오기
  const { data: helpData, isLoading, error: helpError } = useHelpDetail(parseInt(helpId));

  // 시니어 완료 요청 훅 사용
  const { requestCompletion, isPending: isCompleting } = useSeniorHelpCompletion();

  // AuthStore에서 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  // 사용자 역할
  const userRole = user?.role as 'junior' | 'senior' | null;
  
  // Help 완료 요청 함수 (새로운 훅 사용)
  const handleCompleteHelp = () => {
    if (!helpData) {
      console.log('❌ Help 데이터가 없음');
      return;
    }
    console.log('📋 Help 데이터:', helpData);
    requestCompletion({ helpId: helpData.id, helpTitle: helpData.title });
  };

  // 헬프 지원 함수
  const handleApplyHelp = () => {
    console.log('헬프 지원하기');
    // TODO: 헬프 지원 로직 구현
  };

  // 지원자 확인 함수
  const handleCheckApplicants = () => {
    console.log('지원자 확인하기');
    // TODO: 지원자 확인 로직 구현
  };



  if (isLoading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }
  if (helpError) {
    return <div className={styles.errorContainer}>오류: {helpError?.message}</div>;
  }

  return (
    <div className={styles.helpDetailContainer}>
      <TopBar />
      <ImageCarousel images={helpData?.images || []} />
      {helpData?.seniorInfo && <UserInfoSection data={helpData.seniorInfo} />}
      <HelpContent help={helpData || null} />
      <ActionButtons
        help={helpData || null}
        role={userRole}
        isCompleting={isCompleting}
        onCompleteHelp={handleCompleteHelp}
        onApplyHelp={handleApplyHelp}
        onCheckApplicants={handleCheckApplicants}
      />
    </div>
  );
}
