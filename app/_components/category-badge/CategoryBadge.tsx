import React from "react";
import styles from "./CategoryBadge.module.css";

interface CategoryBadgeProps {
  category: number;
  className?: string;
}

const categoryMap: Record<number, string> = {
  1: "청소",
  2: "요리",
  3: "운전",
  4: "상담",
  5: "기타",
};
const categoryClassMap: Record<number, string> = {
  1: "clean",
  2: "cook",
  3: "drive",
  4: "counsel",
  5: "etc",
};
const categoryEmojiMap: Record<number, string> = {
  1: "🧹",
  2: "🍳",
  3: "🚗",
  4: "💬",
  5: "✨",
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className,
}) => {
  const badgeClass =
    styles.category +
    " " +
    styles[categoryClassMap[category] || "etc"] +
    (className ? " " + className : "");
  return (
    <span className={badgeClass}>
      <span>{categoryEmojiMap[category] || "✨"}</span>
      {categoryMap[category] || "기타"}
    </span>
  );
};

export default CategoryBadge;
