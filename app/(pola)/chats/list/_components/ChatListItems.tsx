import Link from 'next/link';
import Image from 'next/image';
import styles from './ChatListItems.module.css';
import { ChatRoomWithDetails } from '@/lib/api_front/chat.api';
import CategoryBadge from '@/app/_components/category-badge/CategoryBadge';
import DummyUser from '@/public/images/dummies/dummy_user.png';

interface ChatListItemsProps {
  chatRooms: ChatRoomWithDetails[];
}

export default function ChatListItems({ chatRooms }: ChatListItemsProps) {
  return (
    <ul className={styles.chatList}>
      {chatRooms.length === 0 ? (
        <li className={styles.emptyState}>채팅방이 없습니다.</li>
      ) : (
        chatRooms.map((room) => (
          <li key={room.contactRoomId}>
            <Link
              href={`/chats/${room.contactRoomId}`}
              className={styles.chatItem}
            >
              <Link href={`/user/profile/${room.opponentProfile.nickname}`}>
                <div className={styles.avatar}>
                  <Image
                    src={room.opponentProfile.profileImgUrl || DummyUser}
                    alt='Profile'
                    width={48}
                    height={48}
                    className={styles.profileImage}
                  />
                </div>
              </Link>
              <div className={styles.info}>
                <div className={styles.name}>
                  {room.opponentProfile.nickname}
                </div>
                <div className={styles.tags}>
                  {room.latestHelp?.category &&
                  room.latestHelp.category.length > 0 ? (
                    room.latestHelp.category
                      .slice(0, 2)
                      .map((cat, index) => (
                        <CategoryBadge
                          key={index}
                          category={cat.id}
                          className={styles.chatCategoryBadge}
                        />
                      ))
                  ) : (
                    <CategoryBadge
                      category={0}
                      className={styles.chatCategoryBadge}
                    />
                  )}
                  {room.latestHelp?.category &&
                    room.latestHelp.category.length > 2 && (
                      <span className={styles.moreCategories}>
                        +{room.latestHelp.category.length - 2}
                      </span>
                    )}
                </div>
              </div>
              {/* <span className={styles.unread}>9</span> */}
            </Link>
          </li>
        ))
      )}
    </ul>
  );
}
