'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './ImageUploader.module.css';
import { useImageContext } from '@/lib/contexts/ImageContext';

interface ImageUploaderProps {
  maxFiles?: number;
  maxFileSize?: number; // MB 단위
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxFiles = 5,
  maxFileSize = 5,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageFiles, addImages, removeImage } = useImageContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    validateAndAddFiles(files);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    removeImage(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndAddFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles: File[] = [];

      for (const file of files) {
        // 파일 크기 체크
        if (file.size > maxFileSize * 1024 * 1024) {
          alert(`${file.name} 파일 크기는 ${maxFileSize}MB 이하여야 합니다.`);
          continue;
        }

        // 이미지 파일 타입 체크
        if (!file.type.startsWith('image/')) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        const totalFiles = imageFiles.length + validFiles.length;
        if (totalFiles > maxFiles) {
          alert(`최대 ${maxFiles}개까지만 업로드할 수 있습니다.`);
          return;
        }
        addImages(validFiles);
      }
    },
    [imageFiles.length, maxFiles, maxFileSize, addImages]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndAddFiles(files);
      }
    },
    [validateAndAddFiles]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
  };

  return (
    <div
      className={`${styles.imageUploader} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 이미지 업로드 영역 */}
      <div
        className={`${styles.imageUploadArea} ${
          isDragOver ? styles.dragOver : ''
        }`}
      >
        {/* 업로드된 이미지들 */}
        {imageFiles.map((file, index) => (
          <div key={index} className={styles.imageItem}>
            <div className={styles.imagePreview}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`업로드된 이미지 ${index + 1}`}
                width={80}
                height={80}
                className={styles.previewImage}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className={styles.removeButton}
                type='button'
                aria-label='이미지 삭제'
              >
                ×
              </button>
            </div>
            <div className={styles.imageInfo}>
              <span className={styles.imageName} title={file.name}>
                {file.name}
              </span>
              <span className={styles.imageSize}>
                {formatFileSize(file.size)}
              </span>
            </div>
          </div>
        ))}

        {imageFiles.length < maxFiles && (
          <div className={styles.addImageButton} onClick={handleImageClick}>
            <div className={styles.addIcon}>+</div>
            <div className={styles.addText}>이미지 추가</div>
            <div className={styles.addSubText}>
              {imageFiles.length}/{maxFiles}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      <div className={styles.uploadInfo}>
        <p>• 최대 {maxFiles}개까지 이미지를 업로드할 수 있습니다.</p>
        <p>• 각 이미지는 {maxFileSize}MB 이하여야 합니다.</p>
        <p>• JPG, PNG, GIF 형식을 지원합니다.</p>
      </div>
    </div>
  );
};

export default ImageUploader;
