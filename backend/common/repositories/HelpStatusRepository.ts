import { supabase } from '@/backend/common/utils/supabaseClient';
import { IHelpStatusRepository } from '@/backend/common/repositories/IHelpStatusRepository';
import { HelpStatus } from '@/backend/common/entities/HelpStatus';

// 에러 처리 헬퍼 함수
const handleSupabaseError = (error: unknown, operation: string): never => {
  console.error(`${operation} 에러:`, error);
  const errorMessage =
    error instanceof Error ? error.message : '알 수 없는 오류';
  throw new Error(`${operation} 실패: ${errorMessage}`);
};

export class HelpStatusRepository implements IHelpStatusRepository {
  // 상태 관리 메서드
  async updateHelpStatus(helpId: number, status: HelpStatus): Promise<boolean> {
    const updateData: { status: HelpStatus } = {
      status,
    };

    const { error } = await supabase
      .from('helps')
      .update(updateData)
      .eq('id', helpId);

    if (error) {
      handleSupabaseError(error, 'Help 상태 업데이트');
    }

    return true;
  }

  async getHelpStatus(helpId: number): Promise<HelpStatus | null> {
    const { data, error } = await supabase
      .from('helps')
      .select('status')
      .eq('id', helpId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터 없음
        return null;
      }
      handleSupabaseError(error, 'Help 상태 조회');
    }

    return (data?.status as HelpStatus) || null;
  }
}
