'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import styles from './ImageCarousel.module.css';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  return (
    <div className={styles.imageSection}>
      {images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={images.length > 1}
          className={styles.swiper}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div className={styles.imageContainer}>
                <Image
                  src={image}
                  alt={`헬프 이미지 ${index + 1}`}
                  fill
                  className={styles.helpImage}
                  onError={(e) => {
                    // 이미지 로드 실패 시 빈칸으로 처리
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={styles.imagePlaceholder}>
          <div className={styles.mountainIcon}>🏔️</div>
        </div>
      )}
    </div>
  );
} 