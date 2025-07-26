import {
  HelpStatus,
  STATUS_TRANSITIONS,
} from '@/backend/common/entities/HelpStatus';

// 인증 코드 생성 함수
export function generateVerificationCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

// 인증 코드 만료 시간 (10분)
export function getVerificationExpiryTime(): number {
  return Date.now() + 10 * 60 * 1000; // 10분 뒤
}

// 인증 코드 유효성 검증 (단순 일치 여부 + 만료 시간)
export function isVerificationCodeValid(
  inputCode: number,
  storedCode: number,
  expiresAt: number
): boolean {
  return inputCode === storedCode && Date.now() < expiresAt;
}

// 상태 전이가 유효한지 검증하는 함수
export function isValidStatusTransition(
  currentStatus: HelpStatus,
  newStatus: HelpStatus
): boolean {
  return STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}
