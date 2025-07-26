import { supabase } from '@/backend/common/utils/supabaseClient';
import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';
import { HelpApplicantEntity } from '@/backend/helps/domains/entities/HelpApplicant';

export interface HelpApplicantData {
  id: number;
  help_id: number;
  junior_id: string;
  is_accepted: boolean;
  applied_at: string;
}

export class SbHelpApplicantRepository implements IHelpApplicantRepository {
  async getApplicantsByHelpId(helpId: number): Promise<HelpApplicantEntity[]> {
    // help_applicants에서 junior_id로 users 테이블 join
    const { data, error } = await supabase
      .from('help_applicants')
      .select('id, help_id, junior_id, is_accepted, applied_at')
      .eq('help_id', helpId);

    if (error) throw new Error(error.message);

    // 엔티티로 변환
    return (data ?? []).map(
      (row: HelpApplicantData) =>
        new HelpApplicantEntity(
          row.id,
          row.help_id,
          row.junior_id,
          row.is_accepted,
          new Date(row.applied_at)
        )
    );
  }

  async createHelpApplication(
    applicant: HelpApplicantEntity
  ): Promise<HelpApplicantEntity> {
    const { data, error } = await supabase
      .from('help_applicants')
      .insert({
        help_id: applicant.helpId,
        junior_id: applicant.juniorId,
        is_accepted: applicant.isAccepted,
        applied_at: applicant.appliedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new HelpApplicantEntity(
      data.id,
      data.help_id,
      data.junior_id,
      data.is_accepted,
      new Date(data.applied_at)
    );
  }

  async acceptHelpApplicant(
    applicant: HelpApplicantEntity
  ): Promise<HelpApplicantEntity> {
    const { data, error } = await supabase
      .from('help_applicants')
      .update({
        is_accepted: true,
      })
      .eq('id', applicant.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new HelpApplicantEntity(
      data.id,
      data.help_id,
      data.junior_id,
      data.is_accepted,
      new Date(data.applied_at)
    );
  }

  async checkDuplicateApplication(
    helpId: number,
    juniorId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('help_applicants')
      .select('id')
      .eq('help_id', helpId)
      .eq('junior_id', juniorId)
      .limit(1);

    if (error) throw new Error(error.message);

    // 데이터가 1개라도 있으면 중복 지원
    return data && data.length > 0;
  }
}
