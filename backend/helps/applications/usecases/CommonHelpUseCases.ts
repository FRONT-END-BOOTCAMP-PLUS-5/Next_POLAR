import { CommonHelpEntity } from '@/backend/helps/domains/entities/CommonHelpEntity';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import {
  HelpListResponseDto,
  HelpDetailResponseDto,
  HelpPreviewResponseDto,
} from '@/backend/helps/applications/dtos/HelpDTO';
import { getNicknameByUuid } from '@/lib/getUserData';

// 헬프 리스트 조회 UseCase (닉네임 기반)
export class GetHelpListUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(): Promise<HelpListResponseDto[] | null> {
    const helpList: CommonHelpEntity[] | null =
      await this.helpRepository.getHelpList();

    if (helpList) {
      // 각 헬프의 seniorId를 닉네임으로 변환
      const helpListWithNicknames = await Promise.all(
        helpList.map(async (help) => {
          const seniorNickname = await getNicknameByUuid(help.seniorId);
          return {
            id: help.id,
            seniorInfo: {
              nickname: seniorNickname || '알 수 없음',
            },
            title: help.title,
            startDate: help.startDate,
            endDate: help.endDate,
            category: help.category,
            content: help.content,
            status: help.status,
            createdAt: help.createdAt,
          };
        })
      );
      return helpListWithNicknames;
    }
    return null;
  }
}

// 헬프 상세 조회 UseCase (닉네임 기반)
export class GetHelpDetailUseCase {
  constructor(private readonly helpRepository: ICommonHelpRepository) {}

  async execute(id: number): Promise<HelpDetailResponseDto | null> {
    const help: CommonHelpEntity | null = await this.helpRepository.getHelpById(
      id
    );

    if (help) {
      const seniorNickname = await getNicknameByUuid(help.seniorId);
      return {
        id: help.id,
        seniorNickname: seniorNickname || '알 수 없음',
        title: help.title,
        startDate: help.startDate,
        endDate: help.endDate,
        category: help.category,
        content: help.content,
        status: help.status,
        createdAt: help.createdAt,
      };
    }
    return null;
  }
}

// 헬프 ID 목록으로 헬프들 조회 UseCase (채팅방용)
export class GetHelpsByIdsUseCase {
  constructor(
    private readonly helpRepository: ICommonHelpRepository,
    private readonly helpImageRepository: IHelpImageRepository
  ) {}

  async execute(helpIds: number[]): Promise<HelpPreviewResponseDto[] | null> {
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

    // 각 헬프의 seniorId를 닉네임으로 변환하고 이미지 정보도 가져오기
    const helpsWithNicknames = await Promise.all(
      helps.map(async (help) => {
        const seniorNickname = await getNicknameByUuid(help.seniorId);
        const images = await this.helpImageRepository.getHelpImageUrlsByHelpId(
          help.id
        );

        return {
          id: help.id,
          seniorNickname: seniorNickname || '알 수 없음',
          title: help.title,
          startDate: help.startDate,
          endDate: help.endDate,
          category: help.category,
          status: help.status,
          createdAt: help.createdAt,
          images: images,
        };
      })
    );

    return helpsWithNicknames;
  }
}
