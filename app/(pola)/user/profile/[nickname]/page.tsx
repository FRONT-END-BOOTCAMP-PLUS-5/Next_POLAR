"use client";
import styles from "./_styles/userProfile.module.css";
import { useParams } from "next/navigation";
import UserTierSection from "@/app/_components/sections/user-tier/UserTierSection";
import UserArchivmentSection from "@/app/_components/sections/user-archivment/UserArchivmentSection";
import UserHelpsSection from "@/app/(pola)/user/profile/[nickname]/_components/user-helps/UserHelpsSection";
import ProfileMenuSection from "./_components/sections/ProfileMenuSection";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useApiQuery } from "@/lib/hooks/useApi";
import { UserProfileResponseDto } from "@/backend/users/user/applications/dtos/UserDtos";
import UserInfoSection from "@/app/_components/commons/common-sections/user-info/UserInfoSection";

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const nickname = params.nickname as string;

  const { data: userProfile } = useApiQuery<UserProfileResponseDto>(
    ["userProfile", nickname],
    `/api/users/${nickname}`,
    {
      enabled: !!nickname,
    }
  );

  return (
    <div className={styles.container}>
      <h1>유저프로필</h1>
      {userProfile && (
        <UserInfoSection data={userProfile as UserProfileResponseDto} />
      )}

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

      <UserHelpsSection
        title="나의 헬프 기록"
        nickname={params.nickname as string}
        chartLabels={["청소", "요리", "운전", "상담", "기타"]}
        chartData={[90, 70, 80, 60, 50]}
        representativeTitle="환경미화원"
        helpCategories={[
          { name: "청소", points: 1200000 },
          { name: "요리", points: 800000 },
          { name: "운전", points: 600000 },
          { name: "상담", points: 400000 },
          { name: "기타", points: 200000 },
        ]}
      />

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
