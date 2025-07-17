import { ValidationError } from '@/backend/common/errors/ValidationError';
import { IImageRepository } from '@/backend/images/domains/repositories/ImageRepository';

// 이미지 파일 검증 클래스
export class ImageValidator {
  static validateImageFile(file: File): void {
    console.log(
      `[ImageValidator] 이미지 파일 검증 시작: ${file.name}, 크기: ${file.size} bytes`
    );

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error(`[ImageValidator] 파일 크기 초과: ${file.size} bytes`);
      throw new ValidationError('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
    }

    // 파일 타입 검증
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      console.error(`[ImageValidator] 지원하지 않는 파일 타입: ${file.type}`);
      throw new ValidationError(
        '지원하는 이미지 형식은 JPEG, PNG, GIF, WebP입니다.'
      );
    }

    console.log(`[ImageValidator] 이미지 파일 검증 성공: ${file.name}`);
  }

  static validateBucketName(bucketName: string): void {
    console.log(`[ImageValidator] 버킷명 검증 시작: ${bucketName}`);

    const allowedBuckets = ['profile-images', 'help-images', 'review-images'];
    if (!allowedBuckets.includes(bucketName)) {
      console.error(`[ImageValidator] 지원하지 않는 버킷명: ${bucketName}`);
      throw new ValidationError('지원하지 않는 이미지 버킷입니다.');
    }

    console.log(`[ImageValidator] 버킷명 검증 성공: ${bucketName}`);
  }

  static validateImageUrl(imageUrl: string): void {
    console.log(`[ImageValidator] 이미지 URL 검증 시작: ${imageUrl}`);

    if (!imageUrl || imageUrl.trim().length === 0) {
      console.error('[ImageValidator] 이미지 URL 검증 실패: 빈 값');
      throw new ValidationError('이미지 URL은 비어있을 수 없습니다.');
    }

    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('https')) {
      console.error(
        `[ImageValidator] 이미지 URL 검증 실패: 프로토콜 오류 - ${imageUrl}`
      );
      throw new ValidationError(
        '이미지 URL은 http 또는 https로 시작해야 합니다.'
      );
    }

    console.log(`[ImageValidator] 이미지 URL 검증 성공: ${imageUrl}`);
  }
}

// 공통 이미지 업로드 UseCase
export class UploadImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(
    file: File,
    bucketName: string,
    nickname: string
  ): Promise<{ url: string }> {
    console.log(
      `[UploadImageUseCase] 이미지 업로드 시작 - Bucket: ${bucketName}, Nickname: ${nickname}`
    );

    try {
      // 1. 이미지 파일 검증
      ImageValidator.validateImageFile(file);

      // 2. 버킷명 검증
      ImageValidator.validateBucketName(bucketName);

      // 3. nickname 기반으로 repository에 전달
      const imageUrl = await this.imageRepository.uploadImage(
        file,
        bucketName,
        nickname
      );

      console.log(
        `[UploadImageUseCase] 이미지 업로드 성공 - URL: ${imageUrl.url}`
      );
      return imageUrl;
    } catch (error) {
      console.error(
        `[UploadImageUseCase] 이미지 업로드 중 오류 발생 - Bucket: ${bucketName}, Nickname: ${nickname}`,
        error
      );
      throw error;
    }
  }
}

// 공통 이미지 조회 UseCase
export class GetImageByUrlUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(
    imageUrl: string,
    bucketName: string
  ): Promise<{ url: string } | null> {
    console.log(
      `[GetImageByUrlUseCase] 이미지 조회 시작 - URL: ${imageUrl}, Bucket: ${bucketName}`
    );

    try {
      // 1. 이미지 URL 검증
      ImageValidator.validateImageUrl(imageUrl);

      // 2. 버킷명 검증
      ImageValidator.validateBucketName(bucketName);

      // 3. 이미지 조회
      const result = await this.imageRepository.getImageByUrl(
        imageUrl,
        bucketName
      );

      if (result) {
        console.log(
          `[GetImageByUrlUseCase] 이미지 조회 성공 - URL: ${result.url}`
        );
      } else {
        console.log(
          `[GetImageByUrlUseCase] 이미지를 찾을 수 없음 - URL: ${imageUrl}`
        );
      }

      return result;
    } catch (error) {
      console.error(
        `[GetImageByUrlUseCase] 이미지 조회 중 오류 발생 - URL: ${imageUrl}, Bucket: ${bucketName}`,
        error
      );
      throw error;
    }
  }
}

// 공통 이미지 삭제 UseCase
export class DeleteImageUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(imageUrl: string, bucketName: string): Promise<boolean> {
    console.log(
      `[DeleteImageUseCase] 이미지 삭제 시작 - URL: ${imageUrl}, Bucket: ${bucketName}`
    );

    try {
      // 1. 이미지 URL 검증
      ImageValidator.validateImageUrl(imageUrl);

      // 2. 버킷명 검증
      ImageValidator.validateBucketName(bucketName);

      // 3. 이미지 삭제
      const success = await this.imageRepository.deleteImage(
        imageUrl,
        bucketName
      );

      if (success) {
        console.log(`[DeleteImageUseCase] 이미지 삭제 성공 - URL: ${imageUrl}`);
      } else {
        console.log(`[DeleteImageUseCase] 이미지 삭제 실패 - URL: ${imageUrl}`);
      }

      return success;
    } catch (error) {
      console.error(
        `[DeleteImageUseCase] 이미지 삭제 중 오류 발생 - URL: ${imageUrl}, Bucket: ${bucketName}`,
        error
      );
      throw error;
    }
  }
}

// 특정 용도별 이미지 UseCase들 (공통 UseCase를 래핑)

// 프로필 이미지 업로드 UseCase
export class UploadProfileImageUseCase {
  private uploadImageUseCase: UploadImageUseCase;

  constructor(imageRepository: IImageRepository) {
    this.uploadImageUseCase = new UploadImageUseCase(imageRepository);
  }

  async execute(file: File, nickname: string): Promise<{ url: string }> {
    return await this.uploadImageUseCase.execute(file, 'profile-images', nickname);
  }
}

// 도움 요청 이미지 업로드 UseCase
export class UploadHelpImageUseCase {
  private uploadImageUseCase: UploadImageUseCase;

  constructor(imageRepository: IImageRepository) {
    this.uploadImageUseCase = new UploadImageUseCase(imageRepository);
  }

  async execute(file: File, nickname: string): Promise<{ url: string }> {
    return await this.uploadImageUseCase.execute(file, 'help-images', nickname);
  }
}

// 리뷰 이미지 업로드 UseCase
export class UploadReviewImageUseCase {
  private uploadImageUseCase: UploadImageUseCase;

  constructor(imageRepository: IImageRepository) {
    this.uploadImageUseCase = new UploadImageUseCase(imageRepository);
  }

  async execute(file: File, nickname: string): Promise<{ url: string }> {
    return await this.uploadImageUseCase.execute(file, 'review-images', nickname);
  }
}
