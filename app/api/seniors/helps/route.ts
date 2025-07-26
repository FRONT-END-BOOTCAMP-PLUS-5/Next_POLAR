import { NextRequest, NextResponse } from 'next/server';
import { GetSeniorHelpsUseCase } from '@/backend/seniors/helps/applications/usecases/GetSeniorHelpsUseCase';
import { SeniorHelpRepository } from '@/backend/seniors/helps/infrastructures/repositories/SeniorHelpRepositories';
import { getNicknameFromCookie } from '@/lib/jwt';
import { SbHelpImageRepository } from '@/backend/images/infrastructures/repositories/SbHelpImageRepository';
import { GetUserByIdUseCase } from '@/backend/users/user/applications/usecases/CommonUserUseCase';
import { SbUserRepository } from '@/backend/users/user/infrastructures/repositories/SbUserRepository';
import { HelpResponseDto } from '@/backend/helps/applications/dtos/HelpDTO';
import { SeniorHelpsResponseDto } from '@/backend/seniors/helps/applications/dtos/SeniorHelpsResponseDto';
import { CreateSeniorHelpRequestDto } from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import { SeniorHelpUseCase } from '@/backend/seniors/helps/applications/usecases/SeniorHelpUseCases';
import { UpdateSeniorHelpRequestDto } from '@/backend/seniors/helps/applications/dtos/SeniorRequest';
import { SbCommonHelpRepository } from '@/backend/helps/infrastructures/repositories/SbCommonHelpRepository';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { UploadHelpImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';

// 의존성 주입을 위한 UseCase 인스턴스 생성
const createGetSeniorHelpsUseCase = () => {
  const repository = new SeniorHelpRepository();
  return new GetSeniorHelpsUseCase(repository);
};

// 시니어가 작성한 헬프 리스트 조회 API
export async function GET(
  request: NextRequest
): Promise<NextResponse<SeniorHelpsResponseDto>> {
  try {
    // 쿠키에서 사용자 정보 가져오기
    const userData = getNicknameFromCookie(request);
    const { nickname } = userData || {};

    if (!nickname) {
      return NextResponse.json(
        { success: false, data: [], message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 시니어가 작성한 헬프 리스트 조회
    const helpEntities = await createGetSeniorHelpsUseCase().execute(nickname);

    if (!helpEntities) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: '헬프 리스트 조회에 실패했습니다.',
        },
        { status: 500 }
      );
    }

    // CommonHelpEntity를 HelpResponseDto로 변환
    // const helpRepository = new SbCommonHelpRepository();
    const imageRepository = new SbHelpImageRepository();
    const userRepository = new SbUserRepository();
    const getUserUseCase = new GetUserByIdUseCase(userRepository);

    const helpDtos: HelpResponseDto[] = [];

    for (const helpEntity of helpEntities) {
      try {
        // 시니어 정보 조회
        const seniorInfo = await getUserUseCase.execute(helpEntity.seniorId);

        // 이미지 URL 조회
        const images = await imageRepository.getHelpImageUrlsByHelpId(
          helpEntity.id
        );

        const helpDto: HelpResponseDto = {
          id: helpEntity.id,
          seniorInfo: {
            nickname: seniorInfo?.nickname || '',
            name: seniorInfo?.name || '',
            profileImgUrl: seniorInfo?.profileImgUrl || '',
            userRole: 'senior' as const,
            address: seniorInfo?.address || '',
          },
          title: helpEntity.title,
          startDate: helpEntity.startDate.toISOString().split('T')[0],
          endDate: helpEntity.endDate.toISOString().split('T')[0],
          category: helpEntity.category,
          content: helpEntity.content,
          status: helpEntity.status,
          createdAt: helpEntity.createdAt.toISOString(),
          images: images || [],
        };

        helpDtos.push(helpDto);
      } catch (error) {
        console.error(`헬프 ${helpEntity.id} 변환 중 오류:`, error);
        // 개별 헬프 변환 실패 시에도 계속 진행
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: helpDtos,
        message: '시니어 헬프 리스트 조회 성공',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('시니어 헬프 리스트 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

// 시니어 헬프 생성 API (닉네임 기반)
export async function POST(req: NextRequest) {
  // 쿠키에서 사용자 정보 가져오기
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};

  if (!nickname) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    // FormData에서 help 데이터 추출
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const subCategoryIds = formData
      .getAll('subCategoryId')
      .map((id) => Number(id));
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    // 필수 필드 검증
    if (!title || !startDate || subCategoryIds.length === 0) {
      return NextResponse.json(
        {
          error:
            '필수 필드가 누락되었습니다. (title, startDate, subCategoryId)',
        },
        { status: 400 }
      );
    }

    // 이미지 파일들 추출
    const imageFiles: File[] = [];
    const imageFilesData = formData.getAll('imageFiles');
    imageFilesData.forEach((item) => {
      if (item instanceof File) {
        imageFiles.push(item);
      }
    });

    // 트랜잭션 시작: 이미지 업로드 + help 생성
    const imageRepository = new SbImageRepository();
    const uploadUseCase = new UploadHelpImageUseCase(imageRepository);
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());

    let uploadedImageUrls: string[] = [];

    try {
      // 1. 이미지 파일들 업로드
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const result = await uploadUseCase.execute(file, nickname);
          return result.url;
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // 2. Help 생성
      const helpReqCreate: CreateSeniorHelpRequestDto = {
        title,
        content: content || '',
        category: subCategoryIds, // subCategoryId를 category 필드로 전달
        startDate,
        endDate,
        imageFiles: uploadedImageUrls,
      };

      const help = await seniorHelpUseCase.createHelp(nickname, helpReqCreate);

      return NextResponse.json(help, { status: 201 });
    } catch (error) {
      // 트랜잭션 실패 시 업로드된 이미지들 삭제
      console.error(
        'Help 생성 중 오류 발생, 업로드된 이미지들 삭제 중:',
        error
      );

      if (uploadedImageUrls.length > 0) {
        try {
          const deletePromises = uploadedImageUrls.map(async (url) => {
            await imageRepository.deleteImage(url, 'help-images');
          });
          await Promise.all(deletePromises);
        } catch (deleteError) {
          console.error('이미지 삭제 중 오류:', deleteError);
        }
      }

      throw error;
    }
  } catch (error) {
    console.error('Help 생성 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 시니어 헬프 수정 API (닉네임 기반)
export async function PUT(req: NextRequest) {
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};
  const helpId = parseInt(req.nextUrl.pathname.split('/').pop() || '0');

  if (!nickname) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  if (!helpId) {
    return NextResponse.json(
      { error: '헬프 ID를 입력해주세요.' },
      { status: 400 }
    );
  }

  const helpReqUpdate: UpdateSeniorHelpRequestDto = {
    ...(await req.json()),
  };

  if (!helpReqUpdate) {
    return NextResponse.json(
      { error: '데이터를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(
      new SeniorHelpRepository(),
      new SbCommonHelpRepository()
    );
    const help = await seniorHelpUseCase.updateHelp(
      nickname,
      helpReqUpdate,
      Number(helpId)
    );
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('Help 수정 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 시니어 헬프 삭제 API (닉네임 기반)
export async function DELETE(req: NextRequest) {
  const userData = getNicknameFromCookie(req);
  const { nickname } = userData || {};
  const helpId = parseInt(req.nextUrl.pathname.split('/').pop() || '0');

  if (!nickname) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  if (!helpId) {
    return NextResponse.json(
      { error: '헬프 ID를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const seniorHelpUseCase = new SeniorHelpUseCase(new SeniorHelpRepository());
    const help = await seniorHelpUseCase.deleteHelp(Number(helpId));
    return NextResponse.json(help, { status: 200 });
  } catch (error) {
    console.error('Help 삭제 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
