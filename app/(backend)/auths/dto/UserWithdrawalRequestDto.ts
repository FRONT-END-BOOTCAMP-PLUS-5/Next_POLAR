// 회원탈퇴 요청 DTO (users 테이블 기준)
export interface UserWithdrawalRequestDto {
  userId: number; // users.id
  type: 'SOFT' | 'HARD'; // 탈퇴 타입
  reason?: string; // 탈퇴 사유(선택)
} 