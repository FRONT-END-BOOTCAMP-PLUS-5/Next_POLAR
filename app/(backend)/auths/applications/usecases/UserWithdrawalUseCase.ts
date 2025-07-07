// 회원탈퇴 유스케이스 (users 테이블 기준)

// users 테이블의 주요 필드
export interface User {
  id: number;
  phone_number: string;
  password: string;
  email: string;
  age: number;
  profile_img_url: string;
  address: string;
  name: string;
  created_at: Date;
  // is_active?: boolean; // soft delete용(필요시)
}

// UserRepository 인터페이스 (DB 연동용)
export interface UserRepository {
  findById(id: number): Promise<User | null>;
  deleteById(id: number): Promise<void>; // 하드 삭제
  // softDeleteById(id: number): Promise<void>; // 소프트 삭제용(필요시)
}

// 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
  constructor(private userRepository: UserRepository) {}

  // 하드 삭제(진짜 삭제)
  async execute(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    await this.userRepository.deleteById(userId);
  }

  // 소프트 삭제 예시 (필요시)
  // async executeSoftDelete(userId: number): Promise<void> {
  //   const user = await this.userRepository.findById(userId);
  //   if (!user) {
  //     throw new Error('사용자를 찾을 수 없습니다.');
  //   }
  //   await this.userRepository.softDeleteById(userId);
  // }
} 