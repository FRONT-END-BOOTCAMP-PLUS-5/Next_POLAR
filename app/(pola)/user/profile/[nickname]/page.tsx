"use client";
import styles from "./_styles/userProfile.module.css";
import { useParams } from "next/navigation";
import UserInfoSection from "@/app/_components/commons/common-sections/user-info/UserInfoSection";
import UserTierSection from "@/app/_components/sections/user-tier/UserTierSection";
import UserArchivmentSection from "@/app/_components/sections/user-archivment/UserArchivmentSection";
import UserHelpsSection from "@/app/(pola)/user/profile/[nickname]/_components/user-helps/UserHelpsSection";
import ProfileMenuSection from "./_components/sections/ProfileMenuSection";

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const nickname = decodeURIComponent(params.nickname as string);

  return (
    <div className={styles.container}>
      <h1>유저프로필</h1>
      <UserInfoSection
        nickname={nickname}
        userName="사나이"
        userType="Jr."
        rating={4.5}
        archiveBadge="환경미화원"
      />

      <UserTierSection
        season="2025 - 1시즌"
        tierName="SILVER"
        currentScore={765000}
        maxScore={800000}
        nextTierScore={35000}
        progressPercentage={95}
      />

      <UserArchivmentSection
        nickname={params.nickname as string}
        title="활동 배지"
        badges={[
          {
            id: 1,
            icon: "🏦",
            tooltip: "자산을 부탁해",
          },
          {
            id: 2,
            icon: "💘",
            tooltip: "두근두근",
          },
          {
            id: 3,
            icon: "🧹",
            tooltip: "청소 마스터",
          },
          {
            id: 4,
            icon: "⭐",
            tooltip: "평점 마스터",
          },
        ]}
      />

      <UserHelpsSection />

      <ProfileMenuSection
        nickname={nickname}
        onLogout={() => {
          // TODO: 로그아웃 로직 구현
          console.log("로그아웃 버튼 클릭됨");
        }}
      />
    </div>
  );
};

export default UserProfilePage;
