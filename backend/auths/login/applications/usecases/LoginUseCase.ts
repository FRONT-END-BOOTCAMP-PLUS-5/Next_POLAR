import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { LoginRepositoryInterface } from '@/backend/auths/login/domains/repository/LoginRepositoryInterface';
import { LoginResponseDTO } from '@/backend/auths/login/applications/dtos/LoginResponse';
import { LoginRequestDTO } from '@/backend/auths/login/applications/dtos/LoginRequest';

// 실제 구현
export class LoginUseCase {
  private loginRepository: LoginRepositoryInterface;

  constructor(loginRepository: LoginRepositoryInterface) {
    this.loginRepository = loginRepository;
  }

  async execute(request: LoginRequestDTO): Promise<LoginResponseDTO> {
    if (!request.loginId || !request.password) {
      throw new Error('로그인 ID와 비밀번호를 입력해주세요.');
    }

    if (
      typeof request.loginId !== 'string' ||
      typeof request.password !== 'string'
    ) {
      throw new Error('잘못된 입력 형식입니다.');
    }

    if (
      request.loginId.trim().length === 0 ||
      request.password.trim().length === 0
    ) {
      throw new Error('로그인 ID와 비밀번호를 입력해주세요.');
    }

    const user = await this.loginRepository.findUserByLoginId(request.loginId);

    if (!user || user.password !== request.password) {
      throw new Error('로그인 정보가 올바르지 않습니다.');
    }

    const accessToken = generateAccessToken({
      nickname: user.nickname,
      role: user.age >= 60 ? 'senior' : 'junior',
    });
    const refreshToken = generateRefreshToken({
      nickname: user.nickname,
      role: user.age >= 60 ? 'senior' : 'junior',
    });

    return new LoginResponseDTO(
      accessToken,
      refreshToken,
      user.nickname,
      user.age >= 60 ? 'senior' : 'junior'
    );
  }
}
