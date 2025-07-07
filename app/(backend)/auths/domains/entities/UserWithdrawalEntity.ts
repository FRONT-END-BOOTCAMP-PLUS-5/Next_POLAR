// 회원탈퇴 엔티티 (도메인)
export interface UserWithdrawal {
  id: string;
  user_id: number;
  reason?: string;
  type: 'SOFT' | 'HARD';
  requested_at: Date;
  processed_at?: Date;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export class UserWithdrawalFactory {
  static create(userId: number, type: 'SOFT' | 'HARD', reason?: string): UserWithdrawal {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      reason,
      type,
      requested_at: new Date(),
      status: 'PENDING',
    };
  }

  static complete(withdrawal: UserWithdrawal): UserWithdrawal {
    return {
      ...withdrawal,
      status: 'COMPLETED',
      processed_at: new Date(),
    };
  }

  static cancel(withdrawal: UserWithdrawal): UserWithdrawal {
    return {
      ...withdrawal,
      status: 'CANCELLED',
      processed_at: new Date(),
    };
  }
}
