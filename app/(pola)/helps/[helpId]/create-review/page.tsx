'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import styles from './CreateReview.module.css';
import ProfileSummary from './_components/ProfileSummary';
import Button from './_components/Button';
import Input from './_components/Input';
import { useCreateReview } from '@/lib/hooks/useCreateReview';
import { useAuthStore } from '@/lib/stores/authStore';
import StarRating from '@/app/_components/commons/ui/StarRating';
import ImageUploader from '@/app/_components/commons/imageUploader/ImageUploader';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useImageContext } from '@/lib/contexts/ImageContext';

export default function CreateReviewPage({ params }: { params: Promise<{ helpId: string }> }) {
  const { helpId } = use(params);
  const [form, setForm] = useState({
    text: '',
  });
  const [starRating, setStarRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hover, setHover] = useState(0);

  const nickname = useAuthStore.getState().user?.nickname;
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = useUserProfile(nickname || '');
  const { imageFiles, clearImages } = useImageContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createReviewMutation = useCreateReview({
    onSuccess: () => {
      setSuccess(true);
      setLoading(false);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!helpId) {
      setError('helpId가 없습니다.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('helpId', helpId);
    formData.append('rating', String(starRating));
    formData.append('text', form.text);
    formData.append('writerNickname', nickname!);
    if (imageFiles.length > 0) {
      formData.append('reviewImgFile', imageFiles[0]);
    }

    createReviewMutation.mutate(formData);
    clearImages();
  };

  return (
    <div className={styles.container}>
      {userProfile && <ProfileSummary user={userProfile} />}
      {loading ? (
        <div className={styles.loadingContainer}>로딩 중...</div>
      ) : error ? (
        <div className={styles.errorContainer}>오류: {error}</div>
      ) : (
        <>
          <h1 className={styles.title}>리뷰 작성</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.ratingSection}>
              <label className={styles.label}>평점</label>
              <StarRating value={starRating} onChange={setStarRating} />
            </div>
            <div className={styles.textSection}>
              <Input
                label="리뷰 내용"
                id="text"
                name="text"
                placeholder="리뷰 내용을 작성해주세요"
                value={form.text}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.imageSection}>
              <label className={styles.label}>이미지 첨부 (선택사항)</label>
              <ImageUploader maxFiles={1} maxFileSize={5} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? '등록 중...' : '리뷰 등록'}
            </Button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>리뷰가 성공적으로 등록되었습니다!</p>}
        </>
      )}
    </div>
  );
} 