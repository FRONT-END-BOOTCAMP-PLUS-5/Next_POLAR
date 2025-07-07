import { UserRepository } from '../repositories/UserRepository';
import { UserWithdrawal } from '../domains/entities/UserWithdrawalEntity';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export class SupabaseUserRepository implements UserRepository {
  async findById(id: number): Promise<any | null> {
    // 실제로는 supabase에서 users 테이블 조회
    return null;
  }
  async deleteById(id: number): Promise<void> {
    // 실제로는 supabase에서 users 테이블 삭제
  }
  async saveWithdrawal(withdrawal: UserWithdrawal): Promise<void> {
    // 실제로는 supabase에서 user_withdrawals 테이블에 저장
  }
} 