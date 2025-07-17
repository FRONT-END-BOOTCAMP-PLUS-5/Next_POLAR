import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SupabaseClient } from '@supabase/supabase-js';
import { SignUpDto } from '../../applications/dtos/SignUpDto';

export class SbAuthRepository implements SignUpRepositoryInterface {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // 회원가입
  async signUp(user: SignUpDto): Promise<SignUpDto | null> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as SignUpDto;
  }
}
