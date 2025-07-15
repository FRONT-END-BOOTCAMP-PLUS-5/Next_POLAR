import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/lib/api_front/images';
import { useImageContext } from '@/lib/contexts/ImageContext';

interface UseImageUploadOptions {
  onSuccess?: (urls: string[]) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = (options?: UseImageUploadOptions) => {
  const { imageFiles, clearImages } = useImageContext();

  const mutation = useMutation({
    mutationFn: async (files: File[]): Promise<string[]> => {
      if (files.length === 0) {
        return [];
      }

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadImage(formData);
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    },
    onSuccess: (urls) => {
      console.log('이미지 업로드 성공:', urls);
      // 업로드 성공 후 Context의 이미지 파일들 클리어
      clearImages();
      options?.onSuccess?.(urls);
    },
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
      options?.onError?.(error);
    },
  });

  const uploadCurrentImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) {
      return [];
    }
    return await mutation.mutateAsync(imageFiles);
  };

  return {
    uploadCurrentImages,
    uploadImages: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error,
    imageFiles, // Context의 이미지 파일들도 반환
  };
};
