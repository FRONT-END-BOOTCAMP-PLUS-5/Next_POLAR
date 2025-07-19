import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './SwiperSection.module.css';
import CategoryGrid from '@/app/_components/CategoryGrid';
import Calendar from './Calendar';

interface Help {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: string;
  seniorNickname: string;
  category: number[];
}

interface SwiperSectionProps {
  currentYear: number;
  currentMonth: number;
  mockHelps: Help[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onSwiperRef: (swiper: SwiperType) => void;
}

export default function SwiperSection({ 
  currentYear, 
  currentMonth, 
  mockHelps, 
  selectedDate, 
  onDateClick, 
  onSwiperRef 
}: SwiperSectionProps) {
  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className={styles.swiperContainer}
        spaceBetween={0}
        slidesPerView={1}
        loop={false}
        onSwiper={onSwiperRef}
      >
        <SwiperSlide className={styles.swiperSlide}>
          <CategoryGrid />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <Calendar 
            year={currentYear} 
            month={currentMonth} 
            helps={mockHelps} 
            onDateClick={onDateClick}
            selectedDate={selectedDate || undefined}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
} 