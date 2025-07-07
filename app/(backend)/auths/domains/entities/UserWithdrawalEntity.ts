// 회원탈퇴 도메인 엔티티
export interface UserWithdrawalData {
  id: string;
  user_id: string; // 탈퇴할 사용자 ID
  withdrawal_reason?: string; // 탈퇴 사유 (선택사항)
  withdrawal_type: 'SOFT' | 'HARD'; // 소프트 삭제 or 하드 삭제
  withdrawal_date: Date;
  is_reversible: boolean; // 복구 가능 여부
  data_retention_days: number; // 데이터 보관 기간 (일)
  processed_at?: Date; // 실제 처리 완료 시간
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

// 회원탈퇴 생성 팩토리
export class UserWithdrawalFactory {
  static create(
    userId: string,
    withdrawalType: 'SOFT' | 'HARD' = 'SOFT',
    withdrawalReason?: string
  ): UserWithdrawalData {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      withdrawal_reason: withdrawalReason,
      withdrawal_type: withdrawalType,
      withdrawal_date: new Date(),
      is_reversible: withdrawalType === 'SOFT', // 소프트 삭제만 복구 가능
      data_retention_days: withdrawalType === 'SOFT' ? 30 : 0, // 소프트는 30일, 하드는 즉시
      status: 'PENDING',
    };
  }

  // 탈퇴 유효성 검사
  static validate(withdrawal: UserWithdrawalData): boolean {
    return !!(
      withdrawal.user_id &&
      withdrawal.withdrawal_type &&
      withdrawal.withdrawal_date &&
      withdrawal.data_retention_days >= 0
    );
  }

  // 탈퇴 처리 시작
  static startProcessing(withdrawal: UserWithdrawalData): UserWithdrawalData {
    return {
      ...withdrawal,
      status: 'PROCESSING',
    };
  }

  // 탈퇴 처리 완료
  static complete(withdrawal: UserWithdrawalData): UserWithdrawalData {
    return {
      ...withdrawal,
      status: 'COMPLETED',
      processed_at: new Date(),
    };
  }

  // 탈퇴 취소
  static cancel(withdrawal: UserWithdrawalData): UserWithdrawalData {
    return {
      ...withdrawal,
      status: 'CANCELLED',
    };
  }

  // 복구 가능 여부 확인
  static canBeRestored(withdrawal: UserWithdrawalData): boolean {
    if (withdrawal.status !== 'COMPLETED') return false;
    if (!withdrawal.is_reversible) return false;

    // 데이터 보관 기간 내인지 확인
    const daysSinceWithdrawal = Math.floor(
      (new Date().getTime() - withdrawal.withdrawal_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return daysSinceWithdrawal <= withdrawal.data_retention_days;
  }

  // 데이터 보관 기간 만료 확인
  static isExpired(withdrawal: UserWithdrawalData): boolean {
    if (withdrawal.withdrawal_type === 'HARD') return true; // 하드 삭제는 즉시 만료

    const daysSinceWithdrawal = Math.floor(
      (new Date().getTime() - withdrawal.withdrawal_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return daysSinceWithdrawal > withdrawal.data_retention_days;
  }
}
