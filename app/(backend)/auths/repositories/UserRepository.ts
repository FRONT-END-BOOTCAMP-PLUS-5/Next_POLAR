// UserRepository 인터페이스 (DB 연동용)
import { UserWithdrawal } from '../domains/entities/UserWithdrawalEntity';

export interface UserRepository {
  findById(id: number): Promise<any | null>;
  deleteById(id: number): Promise<void>; // 하드 삭제
  // softDeleteById(id: number): Promise<void>; // 소프트 삭제용(필요시)
  saveWithdrawal(withdrawal: UserWithdrawal): Promise<void>;
} 