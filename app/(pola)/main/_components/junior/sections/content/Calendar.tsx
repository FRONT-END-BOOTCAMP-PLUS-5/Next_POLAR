'use client';

import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';
import Calendar from 'react-calendar';

interface Help {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: string;
  seniorNickname: string;
  category: number[]; // sub_category의 id 배열
}

interface CalendarProps {
  year: number;
  month: number;
  helps?: Help[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
}

// Big Category 매핑 (sub_category_id -> big_category)
const getBigCategory = (subCategoryId: number): string => {
  // 힘 (1-4), 지능 (5-8), 민첩 (9-12), 매력 (13-16), 인내 (17-20)
  if (subCategoryId >= 1 && subCategoryId <= 4) return '힘';
  if (subCategoryId >= 5 && subCategoryId <= 8) return '지능';
  if (subCategoryId >= 9 && subCategoryId <= 12) return '민첩';
  if (subCategoryId >= 13 && subCategoryId <= 16) return '매력';
  if (subCategoryId >= 17 && subCategoryId <= 20) return '인내';
  return '기타';
};

// Big Category 색상 매핑
const getBigCategoryColor = (bigCategory: string): string => {
  switch (bigCategory) {
    case '힘':
      return '#ff4444'; // 빨강
    case '지능':
      return '#4444ff'; // 파랑
    case '민첩':
      return '#44ff44'; // 연두
    case '매력':
      return '#ff44ff'; // 분홍
    case '인내':
      return '#8844ff'; // 보라
    default:
      return '#888888'; // 회색
  }
};

export default function CustomCalendar({
  year,
  month,
  helps = [], // 기본값으로 빈 배열 사용
  onDateClick,
  selectedDate,
}: CalendarProps) {
  const [value, setValue] = useState<Date>(selectedDate || new Date());
  const [allHelps, setAllHelps] = useState<Help[]>(helps);

  // 컴포넌트 마운트 시 helps 데이터 설정
  useEffect(() => {
    setAllHelps(helps);
  }, [helps]);

  // 특정 날짜의 help 목록 가져오기 (start_date인 help만)
  const getHelpsForDate = (date: Date): Help[] => {
    return allHelps.filter((help) => {
      const helpStart = new Date(help.startDate);
      const targetDate = new Date(date);

      // 날짜 비교 (시간 제외) - start_date와 정확히 일치하는 것만
      const startDate = new Date(
        helpStart.getFullYear(),
        helpStart.getMonth(),
        helpStart.getDate()
      );
      const currentDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );

      return currentDate.getTime() === startDate.getTime();
    });
  };

  // react-calendar의 tileContent prop을 위한 함수
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayHelps = getHelpsForDate(date);

      if (dayHelps.length > 0) {
        return (
          <div className={styles.tileContent}>
            {dayHelps.slice(0, 5).map((help) => {
              const bigCategory = getBigCategory(help.category[0] || 0);
              const color = getBigCategoryColor(bigCategory);
              return (
                <div
                  key={help.id}
                  className={styles.categoryDot}
                  style={{ backgroundColor: color }}
                  title={`${help.title} (${bigCategory})`}
                />
              );
            })}
            {dayHelps.length > 5 && (
              <div className={styles.moreDots}>+{dayHelps.length - 5}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  // react-calendar의 tileClassName prop을 위한 함수
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayHelps = getHelpsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();

      let className = styles.calendarTile;

      if (isToday) className += ` ${styles.today}`;
      if (isSelected) className += ` ${styles.selected}`;
      if (dayHelps.length > 0) className += ` ${styles.hasHelps}`;

      return className;
    }
    return '';
  };

  const handleDateChange = (value: unknown, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 타입 안전성을 위한 런타임 체크
    if (value instanceof Date) {
      setValue(value);
      if (onDateClick) {
        onDateClick(value);
      }
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        locale='ko-KR'
        formatDay={(locale, date) => date.getDate().toString()}
        className={styles.reactCalendar}
      />
    </div>
  );
}
