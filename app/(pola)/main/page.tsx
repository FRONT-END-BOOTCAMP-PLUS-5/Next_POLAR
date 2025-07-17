'use client';

import Junior from '@/app/(pola)/main/_components/junior/JuniorMain';
import Senior from '@/app/(pola)/main/_components/senior/SeniorMain';
import { useAuthStore } from '@/lib/stores/authStore';

export default function MainPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'junior') {
    return <Junior />;
  }
  if (user?.role === 'senior') {
    return <Senior />;
  }
  return <div>로그인이 필요합니다.</div>;
}
