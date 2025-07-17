'use client';

import { useChatRooms } from '@/lib/hooks';
import styles from './ChatList.module.css';

export default function JuniorChatListPage() {
  const { data: chatRoomsData, isLoading, error } = useChatRooms();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.logo}>POLAR</span>
          <span className={styles.spacer}></span>
          <span className={styles.bell}>🔔</span>
        </header>
        <div className={styles.loading}>채팅방 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.logo}>POLAR</span>
          <span className={styles.spacer}></span>
          <span className={styles.bell}>🔔</span>
        </header>
        <div className={styles.error}>
          채팅방 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  const chatRooms = chatRoomsData?.rooms || [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>POLAR</span>
        <span className={styles.spacer}></span>
        <span className={styles.bell}>🔔</span>
      </header>
      <div className={styles.topBar}>
        <span className={styles.edit}>수정하기</span>
        <span className={styles.title}>채팅내역</span>
      </div>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input className={styles.searchInput} placeholder='Search' />
      </div>
      <ul className={styles.chatList}>
        {chatRooms.length === 0 ? (
          <li className={styles.emptyState}>채팅방이 없습니다.</li>
        ) : (
          chatRooms.map((room) => (
            <li className={styles.chatItem} key={room.chatRoomId}>
              <div className={styles.avatar}></div>
              <div className={styles.info}>
                <div className={styles.name}>{room.seniorNickname} 시니어</div>
                <div className={styles.tags}>
                  <span className={styles.tag}>방청소</span>
                  <span className={styles.tag}>헬쓰기</span>
                </div>
              </div>
              <span className={styles.unread}>9</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
