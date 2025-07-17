// 이미지 Repository 인터페이스
export interface IImageRepository {
  uploadImage(file: File, bucketName: string, nickname: string): Promise<{ url: string }>;
  getImageByUrl(imageUrl: string, bucketName: string): Promise<{ url: string } | null>;
  deleteImage(imageUrl: string, bucketName: string): Promise<boolean>;
} 