import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpData } from '@/backend/helps/infrastructures/mappers/CommonHelpDataMapper';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';

// JOIN 결과 타입 정의
type CategoryJoinResult = {
  sub_category_id: number;
  sub_categories: {
    id: number;
    name: string;
    point: number;
    category_id: number;
    categories: {
      id: number;
      name: string;
    }[];
  };
};

export class SbCommonHelpRepository implements ICommonHelpRepository {
  /**
   * help의 카테고리 정보를 조회하는 공통 메서드
   */
  private async getHelpCategories(
    helpId: number
  ): Promise<{ id: number; point: number }[]> {
    const { data: categoryData, error: categoryError } = await supabase
      .from('help_categories')
      .select(
        `
        sub_category_id,
        sub_categories!help_categories_sub_category_id_fkey(
          id,
          name,
          point,
          category_id,
          categories!sub_categories_category_id_fkey(
            id,
            name
          )
        )
      `
      )
      .eq('help_id', helpId);

    if (categoryError) {
      console.error(
        `[SbCommonHelpRepository] Help ${helpId} 카테고리 조회 오류:`,
        categoryError
      );
      return [];
    }

    const categories: { id: number; point: number }[] = [];
    if (categoryData) {
      (categoryData as unknown as CategoryJoinResult[]).forEach((item) => {
        if (item.sub_categories) {
          const subCategoryId = item.sub_categories.id;
          const point = item.sub_categories.point;
          if (
            subCategoryId !== undefined &&
            point !== undefined &&
            !categories.some((c) => c.id === subCategoryId)
          ) {
            categories.push({ id: subCategoryId, point });
          }
        }
      });
    }

    return categories;
  }

  /**
   * HelpData를 CommonHelpEntity로 변환하는 공통 메서드
   */
  private async createHelpEntity(help: HelpData): Promise<CommonHelpEntity> {
    const categories = await this.getHelpCategories(help.id);

    return new CommonHelpEntity(
      help.id,
      help.senior_id,
      help.title,
      new Date(help.start_date),
      new Date(help.end_date),
      categories,
      help.content,
      help.status,
      new Date(help.created_at)
    );
  }

  async getHelpList(): Promise<CommonHelpEntity[] | null> {
    try {
      const { data, error } = await supabase.from('helps').select('*');

      if (!data || error) {
        console.error('[Repository] Supabase 헬프 리스트 조회 오류:', error);
        return Promise.reject(null);
      }

      const helpEntities = await Promise.all(
        data.map((help: HelpData) => this.createHelpEntity(help))
      );

      return helpEntities;
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 리스트 조회 오류:', error);
      throw new Error(`헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpById(id: number): Promise<CommonHelpEntity | null> {
    try {
      const { data: helpData, error: helpError } = await supabase
        .from('helps')
        .select('*')
        .eq('id', id)
        .single();

      if (helpError || !helpData) return null;

      return await this.createHelpEntity(helpData);
    } catch (error) {
      console.error('[Repository] 헬프 상세 조회 오류:', error);
      throw new Error('헬프 상세 조회 오류');
    }
  }

  async getHelpListWithFilter(
    filter: HelpFilterDto
  ): Promise<CommonHelpEntity[] | null> {
    try {
      let query = supabase.from('helps').select('*');

      // 서브 카테고리 필터링 (sub_categories 테이블)
      if (filter.subCategoryIds && filter.subCategoryIds.length > 0) {
        const { data: subCategoryFilteredHelps, error: subCategoryError } =
          await supabase
            .from('help_categories')
            .select('help_id')
            .in('sub_category_id', filter.subCategoryIds);

        if (subCategoryError) {
          console.error(
            '[Repository] 서브 카테고리 필터링 오류:',
            subCategoryError
          );
          return null;
        }

        if (subCategoryFilteredHelps && subCategoryFilteredHelps.length > 0) {
          const helpIds = subCategoryFilteredHelps.map((item) => item.help_id);
          query = query.in('id', helpIds);
        } else {
          // 해당 서브 카테고리의 help가 없으면 빈 결과 반환
          return [];
        }
      }

      // 메인 카테고리 필터링 (categories 테이블)
      if (filter.categoryIds && filter.categoryIds.length > 0) {
        // sub_categories 테이블을 통해 category_id로 필터링
        const { data: categoryFilteredHelps, error: categoryError } =
          await supabase
            .from('help_categories')
            .select(
              `
              help_id,
              sub_categories!help_categories_sub_category_id_fkey(
                category_id
              )
            `
            )
            .in('sub_categories.category_id', filter.categoryIds);

        if (categoryError) {
          console.error(
            '[Repository] 메인 카테고리 필터링 오류:',
            categoryError
          );
          return null;
        }

        if (categoryFilteredHelps && categoryFilteredHelps.length > 0) {
          const helpIds = categoryFilteredHelps.map((item) => item.help_id);
          query = query.in('id', helpIds);
        } else {
          // 해당 메인 카테고리의 help가 없으면 빈 결과 반환
          return [];
        }
      }

      // 날짜 필터링
      if (filter.startDate) {
        query = query.gte('start_date', filter.startDate);
      }
      if (filter.endDate) {
        query = query.lte('end_date', filter.endDate);
      }

      // 상태 필터링
      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      // 페이지네이션
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
      if (filter.offset) {
        query = query.range(
          filter.offset,
          filter.offset + (filter.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (!data || error) {
        console.error(
          '[Repository] Supabase 필터링된 헬프 리스트 조회 오류:',
          error
        );
        return null;
      }

      const helpEntities = await Promise.all(
        data.map((help: HelpData) => this.createHelpEntity(help))
      );

      return helpEntities;
    } catch (error) {
      console.error(
        '[SbCommonHelpRepository] 필터링된 헬프 리스트 조회 오류:',
        error
      );
      throw new Error(`필터링된 헬프 리스트 조회 오류: ${error}`);
    }
  }

  async getHelpCountWithFilter(filter: HelpFilterDto): Promise<number> {
    try {
      let query = supabase.from('helps').select('id', { count: 'exact' });

      // 서브 카테고리 필터링 (sub_categories 테이블)
      if (filter.subCategoryIds && filter.subCategoryIds.length > 0) {
        const { data: subCategoryFilteredHelps, error: subCategoryError } =
          await supabase
            .from('help_categories')
            .select('help_id')
            .in('sub_category_id', filter.subCategoryIds);

        if (subCategoryError) {
          console.error(
            '[Repository] 서브 카테고리 필터링 오류:',
            subCategoryError
          );
          return 0;
        }

        if (subCategoryFilteredHelps && subCategoryFilteredHelps.length > 0) {
          const helpIds = subCategoryFilteredHelps.map((item) => item.help_id);
          query = query.in('id', helpIds);
        } else {
          // 해당 서브 카테고리의 help가 없으면 0 반환
          return 0;
        }
      }

      // 메인 카테고리 필터링 (categories 테이블)
      if (filter.categoryIds && filter.categoryIds.length > 0) {
        // sub_categories 테이블을 통해 category_id로 필터링
        const { data: categoryFilteredHelps, error: categoryError } =
          await supabase
            .from('help_categories')
            .select(
              `
              help_id,
              sub_categories!help_categories_sub_category_id_fkey(
                category_id
              )
            `
            )
            .in('sub_categories.category_id', filter.categoryIds);

        if (categoryError) {
          console.error(
            '[Repository] 메인 카테고리 필터링 오류:',
            categoryError
          );
          return 0;
        }

        if (categoryFilteredHelps && categoryFilteredHelps.length > 0) {
          const helpIds = categoryFilteredHelps.map((item) => item.help_id);
          query = query.in('id', helpIds);
        } else {
          // 해당 메인 카테고리의 help가 없으면 0 반환
          return 0;
        }
      }

      // 날짜 필터링
      if (filter.startDate) {
        query = query.gte('start_date', filter.startDate);
      }
      if (filter.endDate) {
        query = query.lte('end_date', filter.endDate);
      }

      // 상태 필터링
      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      const { count, error } = await query;

      if (error) {
        console.error('[Repository] Supabase 헬프 개수 조회 오류:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('[SbCommonHelpRepository] 헬프 개수 조회 오류:', error);
      return 0;
    }
  }
}
