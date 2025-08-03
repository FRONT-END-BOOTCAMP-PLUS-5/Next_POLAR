import { NextRequest, NextResponse } from 'next/server';

import {
  GetHelpListUseCase,
  GetHelpListWithPaginationUseCase,
} from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';
import { HelpPaginationResponseDto } from '@/backend/helps/applications/dtos/HelpPaginationDto';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createHelpListUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpListUseCase(repository);
};

// 헬프 리스트 조회 API (닉네임 기반 응답)
export async function GET(
  request: NextRequest
): Promise<NextResponse<HelpResponseDto[] | HelpPaginationResponseDto | null>> {
  try {
    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const filter: HelpFilterDto = {};

    // 허용된 쿼리 파라미터 목록
    const allowedParams = [
      'categoryIds',
      'subCategoryIds',
      'startDate',
      'endDate',
      'status',
      'page',
      'limit',
      'offset',
      'pagination',
    ];

    // 쿼리 파라미터 확인
    const requestParams = Array.from(searchParams.keys());

    // 정의되지 않은 쿼리 파라미터 확인
    const hasInvalidParams = requestParams.some(
      (param) => !allowedParams.includes(param)
    );

    if (hasInvalidParams) {
      return NextResponse.json([], { status: 200 });
    }

    // 메인 카테고리 ID 필터 (categories 테이블)
    const categoryIdsParam = searchParams.get('categoryIds');
    if (categoryIdsParam) {
      filter.categoryIds = categoryIdsParam
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }

    // 서브 카테고리 ID 필터 (sub_categories 테이블)
    const subCategoryIdsParam = searchParams.get('subCategoryIds');
    if (subCategoryIdsParam) {
      filter.subCategoryIds = subCategoryIdsParam
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }

    // 날짜 필터
    const startDate = searchParams.get('startDate');
    if (startDate) {
      filter.startDate = startDate;
    }

    const endDate = searchParams.get('endDate');
    if (endDate) {
      filter.endDate = endDate;
    }

    // 상태 필터
    const status = searchParams.get('status');
    if (status) {
      filter.status = status;
    }

    // 페이지네이션 파라미터
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page)) {
        filter.page = page;
      }
    }

    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const limit = parseInt(limitParam);
      if (!isNaN(limit)) {
        filter.limit = limit;
      }
    }

    const offsetParam = searchParams.get('offset');
    if (offsetParam) {
      const offset = parseInt(offsetParam);
      if (!isNaN(offset)) {
        filter.offset = offset;
      }
    }

    // 페이지네이션 모드 확인
    const usePagination =
      searchParams.get('pagination') === 'true' || filter.page !== undefined;

    if (usePagination) {
      // 페이지네이션 모드
      const paginationUseCase = new GetHelpListWithPaginationUseCase(
        new SbCommonHelpRepository()
      );
      const result = await paginationUseCase.execute(filter);

      if (result) {
        // 엔티티를 DTO로 변환
        const helpResponseDtos = await Promise.all(
          result.data.map(async (help) => {
            // 시니어 정보 가져오기
            const getUserUseCase = new CommonUserUseCase(
              new SbUserRepository()
            );
            const seniorUser = await getUserUseCase.getUserByNickname(
              help.seniorInfo.nickname
            );

            // 이미지 URL 가져오기
            const imageRepository = new SbHelpImageRepository();
            const images = await imageRepository.getHelpImageUrlsByHelpId(
              help.id
            );

            return {
              id: help.id,
              seniorInfo: {
                id: seniorUser?.id || '',
                nickname: seniorUser?.nickname || '알 수 없음',
                name: seniorUser?.name || '이름 없음',
                userRole: 'senior' as const,
                profileImgUrl: seniorUser?.profileImgUrl || '',
                address: seniorUser?.address || '주소 정보 없음',
              },
              title: help.title,
              startDate: help.startDate.toString().split('T')[0], // YYYY-MM-DD 형식
              endDate: help.endDate.toString().split('T')[0], // YYYY-MM-DD 형식
              category: help.category,
              content: help.content,
              status: help.status,
              createdAt: help.createdAt.toString(), // ISO 문자열
              images: images,
            };
          })
        );

        const paginationResponse: HelpPaginationResponseDto = {
          data: helpResponseDtos,
          pagination: result.pagination,
        };

        return NextResponse.json(paginationResponse, { status: 200 });
      }
    } else {
      // 기존 모드 (페이지네이션 없음)
      const useCase = createHelpListUseCase();
      const helpEntities = await useCase.execute(filter);

      if (helpEntities) {
        // 엔티티를 DTO로 변환
        const helpResponseDtos = await Promise.all(
          helpEntities.map(async (help) => {
            // 시니어 정보 가져오기
            const getUserUseCase = new CommonUserUseCase(
              new SbUserRepository()
            );
            const seniorUser = await getUserUseCase.getUserByNickname(
              help.seniorInfo.nickname
            );

            // 이미지 URL 가져오기
            const imageRepository = new SbHelpImageRepository();
            const images = await imageRepository.getHelpImageUrlsByHelpId(
              help.id
            );

            return {
              id: help.id,
              seniorInfo: {
                id: seniorUser?.id || '',
                nickname: seniorUser?.nickname || '알 수 없음',
                name: seniorUser?.name || '이름 없음',
                userRole: 'senior' as const,
                profileImgUrl: seniorUser?.profileImgUrl || '',
                address: seniorUser?.address || '주소 정보 없음',
              },
              title: help.title,
              startDate: help.startDate.toString().split('T')[0], // YYYY-MM-DD 형식
              endDate: help.endDate.toString().split('T')[0], // YYYY-MM-DD 형식
              category: help.category,
              content: help.content,
              status: help.status,
              createdAt: help.createdAt.toString(), // ISO 문자열
              images: images,
            };
          })
        );

        return NextResponse.json(helpResponseDtos, { status: 200 });
      }
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('[API] 헬프 리스트 조회 오류:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
