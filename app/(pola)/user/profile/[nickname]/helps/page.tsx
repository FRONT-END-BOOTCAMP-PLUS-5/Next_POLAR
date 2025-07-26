'use client';
import { useState } from 'react';
import HelpListCard from '@/app/_components/commons/list-card/help-list-card/HelpListCard';
import type { HelpListResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import styles from './userHelps.module.css';

// 더미 데이터 생성 함수
const categories = [1, 2, 3, 4, 5];
const names = ['청소왕', '요리여왕', '운전영웅', '상담멘토', '기타달인'];
const titles = [
  '여름맞이 대청소 도우미 모집',
  '쿠킹 클래스 & 점심 제공',
  '병원 동행 운전 봉사',
  '심리 상담 봉사',
  '기타 봉사 모집',
];
const statuses = ['모집중', '진행중', '완료'];
const images = [
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256&q=80',
];

function makeDummyList(count: number): HelpListResponseDto[] {
  const arr: HelpListResponseDto[] = [];
  for (let i = 0; i < count; i++) {
    const cat = [{ id: categories[i % categories.length], point: 100 }];
    arr.push({
      id: i + 1,
      seniorInfo: {
        nickname: `user${i + 1}`,
        name: names[i % names.length],
        profileImgUrl: images[i % images.length],
        address: '서울시 강남구',
        userRole: 'senior',
      },
      title: titles[i % titles.length] + ` #${i + 1}`,
      startDate: new Date(2024, 7 + (i % 5), 10 + (i % 10))
        .toISOString()
        .split('T')[0],
      endDate: new Date(2024, 7 + (i % 5), 11 + (i % 10))
        .toISOString()
        .split('T')[0],
      category: cat,
      content: '더미 컨텐츠입니다.',
      status: statuses[i % statuses.length],
      createdAt: new Date(2024, 6 + (i % 5), 1 + (i % 10)).toISOString(),
    });
  }
  return arr;
}

const ALL_LIST = makeDummyList(30);
const PAGE_SIZE = 10;

export default function HelpsListPage() {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<HelpListResponseDto[]>(
    ALL_LIST.slice(0, PAGE_SIZE)
  );
  const [hasMore, setHasMore] = useState(ALL_LIST.length > PAGE_SIZE);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextList = ALL_LIST.slice(0, nextPage * PAGE_SIZE);
    setList(nextList);
    setPage(nextPage);
    setHasMore(nextList.length < ALL_LIST.length);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 헬프 리스트</h1>
      {list.map((help) => (
        <HelpListCard key={help.id} help={help} />
      ))}
      {hasMore && (
        <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
          더보기
        </button>
      )}
    </div>
  );
}
