import { NextRequest, NextResponse } from 'next/server';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { GetHelpDetailUseCase } from '@/backend/helps/applications/usecases/CommonHelpUseCases';
import { HelpDetailResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { CommonUserUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';

const createHelpDetailUseCase = () => {
  const repository = new SbCommonHelpRepository();
  return new GetHelpDetailUseCase(repository);
};

// 헬프 상세 조회 API (helpId 기반 응답)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: string }> }
): Promise<NextResponse<HelpDetailResponseDto | null>> {
  const { helpId } = await params;
  const helpIdNumber: number = parseInt(helpId);

  try {
    const useCase = createHelpDetailUseCase();
    const helpEntity = await useCase.execute(helpIdNumber);

    if (helpEntity) {
      // 시니어 정보 가져오기
      const getUserUseCase = new CommonUserUseCase(new SbUserRepository());
      const seniorUser = await getUserUseCase.getUserByNickname(
        helpEntity.seniorInfo.nickname
      );

      // 이미지 URL 가져오기
      const imageRepository = new SbHelpImageRepository();
      const images = await imageRepository.getHelpImageUrlsByHelpId(
        helpEntity.id
      );

      const helpDetail: HelpDetailResponseDto = {
        id: helpEntity.id,
        seniorInfo: {
          nickname: seniorUser?.nickname || '알 수 없음',
          name: seniorUser?.name || '이름 없음',
          userRole: 'senior' as const,
          profileImgUrl: seniorUser?.profileImgUrl || '',
          address: '', // 기본값 설정
        },
        title: helpEntity.title,
        startDate: helpEntity.startDate.toString(),
        endDate: helpEntity.endDate.toString(),
        category: helpEntity.category,
        content: helpEntity.content,
        status: helpEntity.status,
        createdAt: helpEntity.createdAt.toString(),
        images: images,
      };

      return NextResponse.json(helpDetail, { status: 200 });
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('[API] 헬프 상세 조회 오류:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
