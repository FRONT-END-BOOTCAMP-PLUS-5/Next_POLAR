'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageContextType {
  imageFiles: File[];
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const addImages = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImageFiles([]);
  };

  const value: ImageContextType = {
    imageFiles,
    addImages,
    removeImage,
    clearImages,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};
