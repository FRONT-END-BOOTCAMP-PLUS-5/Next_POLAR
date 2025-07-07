import { UserData, UserFactory } from '../../domains/entities/UserEntity';

// 리포지토리 인터페이스
export interface UserRepository {
  save(user: UserData): Promise<void>;
  findByEmail(email: string): Promise<UserData | null>;
  findById(id: string): Promise<UserData | null>;
  update(user: UserData): Promise<void>;
  delete(id: string): Promise<void>;
}

// 비밀번호 해시 서비스 인터페이스
export interface PasswordHashService {
  hash(password: string): Promise<string>;
  verify(password: string, hashedPassword: string): Promise<boolean>;
}

// 이메일 중복 확인 서비스 인터페이스
export interface EmailValidationService {
  isEmailAvailable(email: string): Promise<boolean>;
}

// 회원가입 유스케이스
export class UserRegistrationUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHashService: PasswordHashService,
    private emailValidationService: EmailValidationService
  ) {}

  async execute(
    email: string,
    password: string,
    age: number,
    address: string,
    user_type: "Junior" | "Senior" | "Admin",
    profile_url: string = ""
  ): Promise<UserData> {
    // 1. 입력 유효성 검사
    if (!UserFactory.isValidEmail(email)) {
      throw new Error('유효하지 않은 이메일 형식입니다.');
    }

    if (!UserFactory.isStrongPassword(password)) {
      throw new Error('비밀번호는 8자 이상, 대소문자와 숫자를 포함해야 합니다.');
    }

    if (age < 0 || age > 150) {
      throw new Error('유효하지 않은 나이입니다.');
    }

    if (!address || address.trim().length === 0) {
      throw new Error('주소는 필수입니다.');
    }

    // 2. 이메일 중복 확인
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 3. 이메일 사용 가능 여부 확인
    const isEmailAvailable = await this.emailValidationService.isEmailAvailable(email);
    if (!isEmailAvailable) {
      throw new Error('사용할 수 없는 이메일입니다.');
    }

    // 4. 비밀번호 해시
    const hashedPassword = await this.passwordHashService.hash(password);

    // 5. 사용자 생성
    const user = UserFactory.create(email, hashedPassword, age, address, user_type, profile_url);

    // 6. 사용자 유효성 검사
    if (!UserFactory.validate(user)) {
      throw new Error('사용자 정보가 유효하지 않습니다.');
    }

    // 7. 사용자 저장
    await this.userRepository.save(user);

    // 8. 비밀번호 제거 후 반환 (보안상)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserData;
  }
} 