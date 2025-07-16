import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpData } from '@/backend/helps/infrastructures/mappers/CommonHelpDataMapper';

export class SbCommonHelpRepository implements ICommonHelpRepository {
  async getHelpList(): Promise<CommonHelpEntity[] | null> {
    try {
      const { data, error } = await supabase.from('helps').select('*');

      if (!data || error) {
        console.error('[Repository] Supabase 헬프 리스트 조회 오류:', error);
        return Promise.reject(null);
      }

      // 각 help에 대해 카테고리 정보를 가져와서 엔티티 생성
      const helpEntities = await Promise.all(
        data.map(async (help: HelpData) => {
          // help_categories 테이블에서 카테고리 정보 조회
          const { data: categoryData, error: categoryError } = await supabase
            .from('help_categories')
            .select('category_id')
            .eq('help_id', help.id);

          if (categoryError) {
            console.error(
              `[SbCommonHelpRepository] Help ${help.id} 카테고리 조회 오류:`,
              categoryError
            );
          }

          // 카테고리 ID 배열 생성
          const categoryIds = categoryData
            ? categoryData.map((item) => item.category_id)
            : [];

          return new CommonHelpEntity(
            help.id,
            help.senior_id, // UUID
            help.title,
            new Date(help.start_date),
            new Date(help.end_date),
            categoryIds, // help_categories 테이블에서 가져온 카테고리 ID 배열
            help.content,
            help.status,
            new Date(help.created_at)
          );
        })
      );

      return helpEntities;
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 리스트 조회 오류:', error);
      throw new Error(`헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpById(id: number): Promise<CommonHelpEntity | null> {
    try {
      // 1. helps 테이블에서 기본 정보 조회
      const { data: helpData, error: helpError } = await supabase
        .from('helps')
        .select('*')
        .eq('id', id)
        .single();

      if (helpError || !helpData) return null;

      // 2. help_categories 테이블에서 카테고리 정보 조회
      const { data: categoryData, error: categoryError } = await supabase
        .from('help_categories')
        .select('category_id')
        .eq('help_id', id);

      if (categoryError) {
        console.error(
          '[SbCommonHelpRepository] 카테고리 조회 오류:',
          categoryError
        );
        // 카테고리 조회 실패해도 help 정보는 반환
      }

      // 카테고리 ID 배열 생성
      const categoryIds = categoryData
        ? categoryData.map((item) => item.category_id)
        : [];

      return new CommonHelpEntity(
        helpData.id,
        helpData.senior_id, // UUID
        helpData.title,
        new Date(helpData.start_date),
        new Date(helpData.end_date),
        categoryIds, // help_categories 테이블에서 가져온 카테고리 ID 배열
        helpData.content,
        helpData.status,
        new Date(helpData.created_at)
      );
    } catch (error) {
      console.error('[Repository] 헬프 상세 조회 오류:', error);
      throw new Error('헬프 상세 조회 오류');
    }
  }
}
