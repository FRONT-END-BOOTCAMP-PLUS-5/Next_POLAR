"use client";
import Link from "next/link";
import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./userHelps.module.css";
import HelpListCard from "@/app/_components/commons/list-card/HelpListCard";
import type { HelpListResponseDto } from "@/backend/helps/applications/dtos/HelpDTO";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface HelpCategory {
  name: string;
  points: number;
}

interface UserHelpsSectionProps {
  title?: string;
  moreLink?: string;
  chartLabels?: string[];
  chartData?: number[];
  representativeTitle?: string;
  helpCategories?: HelpCategory[];
}

const UserHelpsSection: React.FC<UserHelpsSectionProps> = ({
  title = "헬프 기록",
  moreLink = "/user/profile/achievement",
  chartLabels = ["청소", "요리", "운전", "상담", "기타"],
  chartData = [80, 65, 90, 70, 60],
  representativeTitle = "환경미화원",
  helpCategories = [
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
    { name: "청소", points: 1000000 },
  ],
}) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 10,
          },
        },
        ticks: {
          stepSize: 20,
          font: { size: 10 },
        },
      },
    },
  };

  const chartDataset = {
    labels: chartLabels,
    datasets: [
      {
        label: "나의 헬프 능력치",
        data: chartData,
        backgroundColor: "rgba(68, 110, 232, 0.2)",
        borderColor: "#242425",
        borderWidth: 1,
        pointBackgroundColor: "rgba(68, 110, 232, 1)",
      },
    ],
  };

  // 더미 데이터
  const dummyHelps: HelpListResponseDto[] = [
    {
      id: 1,
      seniorInfo: {
        nickname: "hawaiiKing",
        name: "하와이킹",
        profileImgUrl:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&q=80",
      },
      title: "하와이 특가 7일 퀸 카피올라니 호텔",
      startDate: new Date("2024-11-25"),
      endDate: new Date("2024-12-01"),
      category: 3,
      content: "하와이 여행 및 관광",
      status: "완료",
      createdAt: new Date("2024-10-01"),
    },
    {
      id: 2,
      seniorInfo: {
        nickname: "cleanMaster",
        name: "청소왕",
        profileImgUrl:
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&q=80",
      },
      title: "대청소 도우미 모집",
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-08-10"),
      category: 1,
      content: "여름맞이 대청소",
      status: "완료",
      createdAt: new Date("2024-07-20"),
    },
    {
      id: 3,
      seniorInfo: {
        nickname: "cookQueen",
        name: "요리여왕",
        profileImgUrl:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&q=80",
      },
      title: "쿠킹 클래스 & 점심 제공",
      startDate: new Date("2024-09-05"),
      endDate: new Date("2024-09-05"),
      category: 2,
      content: "함께 요리하고 식사해요",
      status: "완료",
      createdAt: new Date("2024-08-15"),
    },
  ];

  return (
    <section className={styles.userHelpsSection}>
      <div className={styles.userHelpsTitleContainer}>
        <h2>{title}</h2>
        <div className={styles.userArchiveSectionTitleButton}>
          <Link href={moreLink}>더보기</Link>
        </div>
      </div>
      <div className={styles.userHelpsContentContainer}>
        {/* 오른쪽에 배너/기록 등 추가 */}
        <div className={styles.userHelpsChartContainer}>
          <Radar data={chartDataset} options={chartOptions} />
        </div>
        <div className={styles.userHelpsDataContainer}>
          <span className={styles.subTitle}>대표 칭호</span>
          <span className={styles.mainTitle}>{representativeTitle}</span>
          {helpCategories.map((category, index) => (
            <div className={styles.helpsDataContainer} key={index}>
              <div className={styles.helpsCategory}>{category.name}</div>
              <span className={styles.helpsCategoryPoint}>
                {category.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.userHelpList}>
        {dummyHelps.map((help) => (
          <HelpListCard key={help.id} help={help} />
        ))}
      </div>
    </section>
  );
};

export default UserHelpsSection;
