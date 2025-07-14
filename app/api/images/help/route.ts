import { NextRequest, NextResponse } from 'next/server';
import { UploadHelpImageUseCase } from '@/backend/images/applications/usecases/ImageUseCase';
import { SbImageRepository } from '@/backend/images/infrastructures/repositories/SbImageRepository';
import { getNicknameFromCookie } from '@/lib/jwt';

// 도움 요청 이미지 업로드 (POST)
export async function POST(
  request: NextRequest
): Promise<NextResponse<{ url: string } | { error: string }>> {
  console.log('[API] POST /api/images/help 호출됨');

  try {
    // 사용자 인증 - 쿠키에서 nickname 추출
    const nickname = getNicknameFromCookie(request);
    if (!nickname) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // FormData 전체 내용 로깅
    console.log('[API] FormData 전체 내용:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
      if (value instanceof File) {
        console.log(`    - 파일명: ${value.name}`);
        console.log(`    - 크기: ${value.size} bytes`);
        console.log(`    - 타입: ${value.type}`);
      }
    }
    
    // 여러 가능한 파일 필드명을 시도
    const possibleFileKeys = ['file', 'image', 'upload', 'photo', 'helpImage'];
    let file: File | null = null;
    let foundKey = '';

    for (const key of possibleFileKeys) {
      const value = formData.get(key);
      if (value instanceof File) {
        file = value;
        foundKey = key;
        console.log(`[API] 파일을 찾았습니다 - 키: ${key}`);
        break;
      }
    }

    if (!file || !(file instanceof File)) {
      console.error('[API] 파일이 누락되었거나 유효하지 않습니다');
      return NextResponse.json(
        { error: '유효한 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(
      `[API] 도움 요청 이미지 업로드 시작 - 사용자: ${nickname}`
    );

    // 이미지 업로드
    const imageRepository = new SbImageRepository();
    const uploadUseCase = new UploadHelpImageUseCase(imageRepository);
    const result = await uploadUseCase.execute(file, nickname);

    if (!result) {
      console.error('[API] 이미지 업로드 실패');
      return NextResponse.json(
        { error: '이미지 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[API] 도움 요청 이미지 업로드 성공:', result.url);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[API] 도움 요청 이미지 업로드 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 