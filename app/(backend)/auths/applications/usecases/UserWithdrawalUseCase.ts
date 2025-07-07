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
  saveWithdrawal(withdrawal: Withdrawal): Promise<void>;
}

// 회원탈퇴 유스케이스
export class UserWithdrawalUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: number, type: 'SOFT' | 'HARD', reason?: string): Promise<void> {
    // 1. 사용자 존재 확인
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');

    // 2. 탈퇴 엔티티 생성 및 저장
    const withdrawal = UserWithdrawalFactory.create(userId, type, reason);
    await this.userRepository.saveWithdrawal(withdrawal);

    // 3. 실제 사용자 삭제 (하드/소프트)
    if (type === 'HARD') {
      await this.userRepository.deleteById(userId);
    } else {
      // await this.userRepository.softDeleteById(userId);
    }
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