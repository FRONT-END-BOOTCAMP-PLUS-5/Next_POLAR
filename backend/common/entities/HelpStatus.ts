// 공용 도움 상태 enum
export enum HelpStatus {
  OPEN = 'open',
  CONNECTING = 'connecting',
  COMPLETED = 'completed',
}

// 상태 전환 규칙 정의
export const STATUS_TRANSITIONS: Record<HelpStatus, HelpStatus[]> = {
  [HelpStatus.OPEN]: [HelpStatus.CONNECTING],
  [HelpStatus.CONNECTING]: [HelpStatus.COMPLETED],
  [HelpStatus.COMPLETED]: [], // 종료 상태
};

// 상태별 한글 설명
export const STATUS_DESCRIPTIONS: Record<HelpStatus, string> = {
  [HelpStatus.OPEN]: '지원 대기 중',
  [HelpStatus.CONNECTING]: '주니어와 연결됨',
  [HelpStatus.COMPLETED]: '완료됨',
};
