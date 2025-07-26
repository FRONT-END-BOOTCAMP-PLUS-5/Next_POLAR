import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { HelpFilterDto } from '@/backend/helps/applications/dtos/HelpFilterDto';
import { HelpResponseDto } from '../dtos/HelpDTO';
import { CommonHelpMapper } from '../mappers/CommonHelpMapper';

// 헬프 리스트 조회 UseCase (DTO 반환)
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(filter?: HelpFilterDto): Promise<HelpResponseDto[] | null> {
    const helpList: CommonHelpEntity[] | null = filter
      ? await this.helpRepository.getHelpListWithFilter(filter)
      : await this.helpRepository.getHelpList();

    if (!helpList) {
      return null;
    }

    return CommonHelpMapper.toDtoList(helpList);
  }
}

// 헬프 상세 조회 UseCase (DTO 반환)
export class GetHelpDetailUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(id: number): Promise<HelpResponseDto | null> {
    const help: CommonHelpEntity | null = await this.helpRepository.getHelpById(
      id
    );

    if (!help) {
      return null;
    }

    return CommonHelpMapper.toDto(help);
  }
}

// 페이지네이션을 지원하는 헬프 리스트 조회 UseCase
export class GetHelpListWithPaginationUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(
    filter: HelpFilterDto
  ): Promise<{
    data: HelpResponseDto[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  } | null> {
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

    // Entity를 DTO로 변환
    const helpDtos = await CommonHelpMapper.toDtoList(helpList);

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      data: helpDtos,
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
