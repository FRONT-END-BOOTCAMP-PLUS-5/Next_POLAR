import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';

// 헬프 리스트 조회 UseCase (엔티티 반환)
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(filter?: HelpFilterDto): Promise<CommonHelpEntity[] | null> {
    const helpList: CommonHelpEntity[] | null = filter
      ? await this.helpRepository.getHelpListWithFilter(filter)
      : await this.helpRepository.getHelpList();

    return helpList;
  }
}

// 헬프 상세 조회 UseCase (엔티티 반환)
export class GetHelpDetailUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(id: number): Promise<CommonHelpEntity | null> {
    const help: CommonHelpEntity | null = await this.helpRepository.getHelpById(
      id
    );

    return help;
  }
}

// 헬프 ID 목록으로 헬프들 조회 UseCase (채팅방용)
export class GetHelpsByIdsUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(helpIds: number[]): Promise<CommonHelpEntity[] | null> {
    if (!helpIds || helpIds.length === 0) {
      return [];
    }

    const helps: CommonHelpEntity[] = [];

    // 각 helpId로 헬프 정보 조회
    for (const helpId of helpIds) {
      const help = await this.helpRepository.getHelpById(helpId);
      if (help) {
        helps.push(help);
      }
    }

    if (helps.length === 0) {
      return [];
    }

    // 생성일 기준으로 정렬 (최신순)
    helps.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return helps;
  }
}

// 페이지네이션을 지원하는 헬프 리스트 조회 UseCase
export class GetHelpListWithPaginationUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(
    filter: HelpFilterDto
  ): Promise<{ data: CommonHelpEntity[]; pagination: any } | null> {
    // 페이지네이션 파라미터 설정
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;

    // 필터에 페이지네이션 정보 추가
    const paginationFilter: HelpFilterDto = {
      ...filter,
      limit,
      offset,
    };

    // 데이터와 총 개수를 병렬로 조회
    const [helpList, totalCount] = await Promise.all([
      this.helpRepository.getHelpListWithFilter(paginationFilter),
      this.helpRepository.getHelpCountWithFilter(filter),
    ]);

    if (!helpList) {
      return null;
    }

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: helpList,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
