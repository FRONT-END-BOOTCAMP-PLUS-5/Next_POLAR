"use client";
import React from "react";
import Image from "next/image";
import styles from "./HelpListCard.module.css";
import CategoryBadge from "@/app/_components/category-badge/CategoryBadge";
import type { HelpListResponseDto } from "@/backend/helps/applications/dtos/HelpDTO";

interface HelpListCardProps {
  help: HelpListResponseDto;
}

const getRewardByCategory = (category: number) => {
  // 카테고리별로 고정된 seed로 임의의 점수 생성 (10,000~100,000, 10,000 단위)
  const base = (category * 23457) % 10;
  return (base + 1) * 10000;
};

const HelpListCard: React.FC<HelpListCardProps> = ({ help }) => {
  const { seniorInfo, title, startDate, endDate, category, status } = help;

  // 날짜 포맷
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <Image
          src={seniorInfo.profileImgUrl || "/default-profile.png"}
          alt="썸네일"
          width={100}
          height={100}
          className={styles.thumbnailImg}
          style={{ objectFit: "cover", borderRadius: "0.8rem" }}
          priority={true}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.topRow}>
          <CategoryBadge category={category} />
          <span className={styles.status}>{status}</span>
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subInfo}>
          <span className={styles.nickname}>
            {seniorInfo.name || seniorInfo.nickname}
          </span>
          <span className={styles.date}>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </span>
          <span className={styles.reward}>
            {getRewardByCategory(category).toLocaleString()}점
          </span>
        </div>
      </div>
    </div>
  );
};

export default HelpListCard;
