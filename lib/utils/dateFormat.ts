// 날짜 포맷 유틸리티 함수들

/**
 * 날짜를 "YYYY.MM.DD" 형식으로 포맷
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

/**
 * 날짜를 "MM.DD" 형식으로 포맷 (년도 제외)
 */
export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${month}.${day}`;
};

/**
 * 날짜 범위를 "YYYY.MM.DD ~ YYYY.MM.DD" 형식으로 포맷
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start} ~ ${end}`;
};

/**
 * 날짜 범위를 "MM.DD ~ MM.DD" 형식으로 포맷 (년도 제외)
 */
export const formatDateRangeShort = (
  startDate: string | Date,
  endDate: string | Date
): string => {
  const start = formatDateShort(startDate);
  const end = formatDateShort(endDate);

  return `${start} ~ ${end}`;
};

/**
 * 상대적 시간 표시 (예: "3일 전", "1주일 전")
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};
