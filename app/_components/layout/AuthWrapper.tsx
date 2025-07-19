'use client';


import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useReviewAccess } from '@/lib/hooks/auth/useReviewAccess';
import { useChatRoomAccess } from "@/lib/hooks/auth/useChatRoomAccess";
import { useAuthStore } from '@/lib/stores/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 로그인/회원가입 페이지인지 확인
  const isAuthPage = pathname === '/login' || pathname === '/sign-up';

  // 온보딩 페이지(메인 페이지)인지 확인
  const isOnboardingPage = pathname === '/';

  // 리뷰 생성 페이지인지 확인
  const isReviewCreatePage = pathname.match(/^\/helps\/[0-9]+\/create-review/);
  
  // 헬프 생성 페이지인지 확인
  const isHelpCreatePage = pathname === '/helps/create';
  
  // 프로필 설정 페이지인지 확인
  const isProfileSettingsPage = pathname.match(/^\/user\/profile\/[^\/]+\/settings$/);
  
  // 프로필 페이지인지 확인
  const isProfilePage = pathname.match(/^\/user\/profile$/);
  
  // 채팅방 페이지인지 확인
  const isChatRoomPage = pathname.match(/^\/chats\/[0-9]+$/);
  
  // 리뷰 생성 권한 확인 (nickname이 있을 때만)
  const reviewHelpId = isReviewCreatePage
    ? Number(params.helpId || pathname.split('/')[2])
    : 0;
  const { data: reviewAccessData, isLoading: reviewLoading } = useReviewAccess({
    nickname: user?.nickname || '',
    helpId: reviewHelpId,
  });
  
  // API 응답에서 hasAccess 값을 추출 (boolean 직접 반환)
  const hasReviewAccess = reviewAccessData;
  
  // 채팅방 접근 권한 확인
  const chatRoomId = isChatRoomPage ? Number(pathname.split('/')[2]) : 0;
  const { data: chatAccessData, isLoading: chatLoading } = useChatRoomAccess({
    nickname: user?.nickname || '',
    chatRoomId
  });
  
  // API 응답에서 hasAccess 값을 추출
  const hasChatAccess = chatAccessData?.hasAccess;

  useEffect(() => {
    // Zustand persist가 초기화된 후에만 체크
    if (isAuthenticated !== undefined) {
      setIsInitialized(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 로그인/회원가입 페이지에서는 인증 체크 건너뛰기
    if (isAuthPage) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
  }, [isInitialized, isAuthenticated, user, router, isAuthPage]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 로그인된 상태에서 로그인/회원가입 페이지로 접근하면 홈으로 리다이렉트
    if (isAuthPage && isAuthenticated && user) {
      router.replace('/main');
      return;
    }

    // 로그인된 상태에서 온보딩 페이지로 접근하면 메인으로 리다이렉트
    if (isOnboardingPage && isAuthenticated && user) {
      router.replace('/main');
      return;
    }
  }, [isInitialized, isAuthPage, isOnboardingPage, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음
    // 리뷰 생성 페이지에서 권한이 없으면 홈으로 리다이렉트
    if (isReviewCreatePage && !reviewLoading && hasReviewAccess !== true) {
      alert('리뷰를 작성할 권한이 없습니다.');
      router.replace('/main');
    }
  }, [isInitialized, isReviewCreatePage, reviewLoading, hasReviewAccess, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // helps/create 페이지에서 senior가 아닌 경우 홈으로 리다이렉트
    if (isHelpCreatePage && user?.role !== 'senior') {
      alert('시니어만 도움말을 생성할 수 있습니다.');
      router.replace('/main');
    }
  }, [isInitialized, isHelpCreatePage, user?.role, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음

    // 프로필 페이지에서 user nickname이 없을 때 홈으로 리다이렉트
    if (isProfilePage) {
      router.replace('/main');
      return;
    }

    // 프로필 설정 페이지에서 본인의 프로필이 아닌 경우 홈으로 리다이렉트
    if (isProfileSettingsPage) {
      const urlNickname = pathname.split('/')[3]; // /user/profile/[nickname]/settings에서 nickname 추출
      if (user?.nickname !== urlNickname) {
        alert('본인의 프로필만 수정할 수 있습니다.');
        router.replace('/main');
      }
    }
  }, [isInitialized, isProfilePage, isProfileSettingsPage, user?.nickname, pathname, router]);

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전에는 리다이렉트하지 않음
    
    // 채팅방 페이지에서 접근 권한이 없으면 홈으로 리다이렉트
    if (isChatRoomPage && !chatLoading && hasChatAccess !== true) {
      alert('채팅방에 접근할 권한이 없습니다.');
      router.replace("/main");
    }
  }, [isInitialized, isChatRoomPage, chatLoading, hasChatAccess, router]);

  // 로그인된 상태에서 로그인/회원가입 페이지나 온보딩 페이지로 접근하면 렌더링하지 않음
  if ((isAuthPage || isOnboardingPage) && isAuthenticated && user) {
    return null;
  }

  // 로그인/회원가입 페이지에서는 인증 체크 없이 렌더링
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 초기화 전에는 로딩 상태
  if (!isInitialized) return null;
  
  // 로그인하지 않은 경우 아무것도 렌더링하지 않음 (이미 리다이렉트됨)
  if (!isAuthenticated || !user) return null;
  if (isReviewCreatePage && reviewLoading) return null; // 권한 확인 중
  if (isReviewCreatePage && hasReviewAccess !== true) return null; // 권한이 없으면 렌더링하지 않음
  if (isHelpCreatePage && user?.role !== 'senior') return null; // senior가 아니면 렌더링하지 않음

  if (isProfilePage) return null; // 프로필 페이지에서 user nickname이 없을 때 렌더링하지 않음
  if (isProfileSettingsPage && user?.nickname !== pathname.split('/')[3]) return null; // 본인의 프로필이 아니면 렌더링하지 않음
  if (isChatRoomPage && chatLoading) return null; // 채팅방 권한 확인 중
  if (isChatRoomPage && hasChatAccess !== true) return null; // 채팅방 접근 권한이 없으면 렌더링하지 않음


  return <>{children}</>;
}
