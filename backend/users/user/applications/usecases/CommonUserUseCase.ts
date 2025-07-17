// 회원 정보 조회 및 수정 UseCase
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';

// 특정 사용자 조회 UseCase
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(id: string): Promise<CommonUserEntity | null> {
    return this.userRepository.getUserById(id);
  }
}

// 회원 정보 수정 UseCase
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(id: string, updateData: CommonUserEntity): Promise<CommonUserEntity | null> {
    return this.userRepository.updateUser(id, updateData);
  }
}

// 검증 에러 클래스
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 사용자 정보 검증 클래스
export class UserValidator {
  static validatePhoneNumber(phoneNumber: string): void {
    console.log(`[Validator] 전화번호 검증 시작: ${phoneNumber}`);

    if (!phoneNumber || phoneNumber.trim().length === 0) {
      console.error('[Validator] 전화번호 검증 실패: 빈 값');
      throw new ValidationError('전화번호는 비어있을 수 없습니다.');
    }
    // 전화번호 형식 검증 (숫자만 허용, 하이픈 제거)
    const cleanPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
    if (!/^\d+$/.test(cleanPhoneNumber)) {
      console.error(
        `[Validator] 전화번호 검증 실패: 숫자가 아닌 문자 포함 - ${phoneNumber}`
      );
      throw new ValidationError('전화번호는 숫자만 입력 가능합니다.');
    }
    if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 11) {
      console.error(
        `[Validator] 전화번호 검증 실패: 길이 오류 - ${cleanPhoneNumber.length}자리`
      );
      throw new ValidationError('전화번호는 10-11자리여야 합니다.');
    }

    console.log(`[Validator] 전화번호 검증 성공: ${cleanPhoneNumber}`);
  }

  static validatePassword(password: string): void {
    console.log(`[Validator] 비밀번호 검증 시작: 길이 ${password.length}`);

    if (!password || password.length < 6) {
      console.error(
        `[Validator] 비밀번호 검증 실패: 길이 부족 - ${password.length}자리`
      );
      throw new ValidationError('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    console.log('[Validator] 비밀번호 검증 성공');
  }

  static validateEmail(email: string): void {
    console.log(`[Validator] 이메일 검증 시작: ${email}`);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`[Validator] 이메일 검증 실패: 형식 오류 - ${email}`);
      throw new ValidationError('유효한 이메일 형식이 아닙니다.');
    }

    console.log(`[Validator] 이메일 검증 성공: ${email}`);
  }

  static validateAge(age: number): void {
    console.log(`[Validator] 나이 검증 시작: ${age}`);

    if (age < 0 || age > 150) {
      console.error(`[Validator] 나이 검증 실패: 범위 오류 - ${age}`);
      throw new ValidationError('나이는 0-150 사이의 값이어야 합니다.');
    }

    console.log(`[Validator] 나이 검증 성공: ${age}`);
  }

  static validateProfileImageUrl(url: string): void {
    console.log(`[Validator] 프로필 이미지 URL 검증 시작: ${url}`);

    if (url && !url.startsWith('http') && !url.startsWith('https')) {
      console.error(
        `[Validator] 프로필 이미지 URL 검증 실패: 프로토콜 오류 - ${url}`
      );
      throw new ValidationError(
        '프로필 이미지 URL은 http 또는 https로 시작해야 합니다.'
      );
    }

    console.log(`[Validator] 프로필 이미지 URL 검증 성공: ${url}`);
  }

  static validateAddress(address: string): void {
    console.log(`[Validator] 주소 검증 시작: ${address}`);

    if (!address || address.trim().length === 0) {
      console.error('[Validator] 주소 검증 실패: 빈 값');
      throw new ValidationError('주소는 비어있을 수 없습니다.');
    }

    console.log(`[Validator] 주소 검증 성공: ${address}`);
  }

  static validateName(name: string): void {
    console.log(`[Validator] 이름 검증 시작: ${name}`);

    if (!name || name.trim().length === 0) {
      console.error('[Validator] 이름 검증 실패: 빈 값');
      throw new ValidationError('이름은 비어있을 수 없습니다.');
    }
    if (name.length > 50) {
      console.error(
        `[Validator] 이름 검증 실패: 길이 초과 - ${name.length}자리`
      );
      throw new ValidationError('이름은 50자를 초과할 수 없습니다.');
    }

    console.log(`[Validator] 이름 검증 성공: ${name}`);
  }

  static validateNickname(nickname: string): void {
    console.log(`[Validator] 닉네임 검증 시작: ${nickname}`);

    if (!nickname || nickname.trim().length === 0) {
      console.error('[Validator] 닉네임 검증 실패: 빈 값');
      throw new ValidationError('닉네임은 비어있을 수 없습니다.');
    }
    if (nickname.length > 30) {
      console.error(
        `[Validator] 닉네임 검증 실패: 길이 초과 - ${nickname.length}자리`
      );
      throw new ValidationError('닉네임은 30자를 초과할 수 없습니다.');
    }

    console.log(`[Validator] 닉네임 검증 성공: ${nickname}`);
  }
}

// 사용자 정보 업데이트 인터페이스 (비밀번호 포함)
export interface UserProfileUpdate {
  phoneNumber?: string;
  email?: string;
  age?: number;
  profile_img_url?: string;
  address?: string;
  name?: string;
  nickname?: string;
  password?: string;
}

// 공용 사용자 Use Case
export class CommonUserUseCase {
  constructor(private readonly userRepository: IUserRepository) { }

  // 특정 사용자 조회
  async getUserById(id: string): Promise<CommonUserEntity | null> {
    console.log(`[UseCase] 사용자 조회 시작 - ID: ${id}`);

    try {
      const user = await this.userRepository.getUserById(id);

      if (user) {
        console.log(`[UseCase] 사용자 조회 성공 - ID: ${id}`, user.toJSON());
      } else {
        console.log(`[UseCase] 사용자를 찾을 수 없음 - ID: ${id}`);
      }

      return user;
    } catch (error) {
      console.error(`[UseCase] 사용자 조회 중 오류 발생 - ID: ${id}`, error);
      throw error;
    }
  }

  // nickname으로 사용자 조회
  async getUserByNickname(nickname: string): Promise<CommonUserEntity | null> {
    console.log(`[UseCase] 사용자 조회 시작 - nickname: ${nickname}`);

    try {
      const user = await this.userRepository.getUserByNickname(nickname);

      if (user) {
        console.log(`[UseCase] 사용자 조회 성공 - nickname: ${nickname}`, user.toJSON());
      } else {
        console.log(`[UseCase] 사용자를 찾을 수 없음 - nickname: ${nickname}`);
      }

      return user;
    } catch (error) {
      console.error(`[UseCase] 사용자 조회 중 오류 발생 - nickname: ${nickname}`, error);
      throw error;
    }
  }

  // 프로필 이미지 삭제 (빈 프로필로 설정)
  async deleteProfileImage(id: string): Promise<CommonUserEntity> {
    console.log(`[UseCase] 프로필 이미지 삭제 시작 - ID: ${id}`);

    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      console.log(
        `[UseCase] 기존 사용자 정보 - ID: ${id}`,
        existingUser.toJSON()
      );

      // 프로필 이미지 URL을 빈 문자열로 설정
      const updatedUser = new CommonUserEntity(
        existingUser.id,
        existingUser.uuid,
        existingUser.phoneNumber,
        existingUser.password,
        existingUser.email,
        existingUser.age,
        '', // 빈 문자열로 설정
        existingUser.address,
        existingUser.name,
        existingUser.nickname,
        existingUser.createdAt
      );

      console.log(
        `[UseCase] 프로필 이미지 삭제용 Entity 생성 완료 - ID: ${id}`,
        updatedUser.toJSON()
      );

      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 프로필 이미지 삭제 실패 - Repository 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('프로필 이미지 삭제에 실패했습니다.');
      }

      console.log(
        `[UseCase] 프로필 이미지 삭제 성공 - ID: ${id}`,
        result.toJSON()
      );
      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 이미지 삭제 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }

  // 사용자 프로필 업데이트 (비밀번호 포함)
  async updateUserProfile(
    id: string,
    updates: UserProfileUpdate
  ): Promise<CommonUserEntity> {
    console.log(`[UseCase] 사용자 프로필 업데이트 시작 - ID: ${id}`, updates);

    try {
      // 기존 사용자 조회
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        console.error(
          `[UseCase] 프로필 업데이트 실패 - 사용자를 찾을 수 없음 - ID: ${id}`
        );
        throw new ValidationError('사용자를 찾을 수 없습니다.');
      }

      console.log(
        `[UseCase] 기존 사용자 정보 - ID: ${id}`,
        existingUser.toJSON()
      );


      // 업데이트할 필드 검증
      if (updates.phoneNumber) {
        UserValidator.validatePhoneNumber(updates.phoneNumber);
      }
      if (updates.email) {
        UserValidator.validateEmail(updates.email);
      }
      if (updates.age !== undefined) {
        UserValidator.validateAge(updates.age);
      }
      if (updates.profile_img_url) {
        UserValidator.validateProfileImageUrl(updates.profile_img_url);
      }
      if (updates.address) {
        UserValidator.validateAddress(updates.address);
      }
      if (updates.name) {
        UserValidator.validateName(updates.name);
      }
      if (updates.nickname !== undefined) {
        console.log(`[UseCase] 닉네임 검증 - ID: ${id}, 값: ${updates.nickname}`);
        UserValidator.validateNickname(updates.nickname);
      }
      if (updates.password !== undefined) {
        console.log(
          `[UseCase] 비밀번호 검증 - ID: ${id}, 길이: ${updates.password.length}`
        );
        UserValidator.validatePassword(updates.password);
      }

      // 업데이트된 사용자 Entity 생성
      const updatedUser = new CommonUserEntity(
        existingUser.id,
        existingUser.uuid,
        updates.phoneNumber ?? existingUser.phoneNumber,
        updates.password ?? existingUser.password,
        updates.email ?? existingUser.email,
        updates.age ?? existingUser.age,
        updates.profile_img_url ?? existingUser.profileImgUrl,
        updates.address ?? existingUser.address,
        updates.name ?? existingUser.name,
        updates.nickname ?? existingUser.nickname,
        existingUser.createdAt
      );

      console.log(
        `[UseCase] 업데이트된 사용자 Entity 생성 완료 - ID: ${id}`,
        updatedUser.toJSON()
      );

      // Repository를 통해 업데이트
      const result = await this.userRepository.updateUser(id, updatedUser);
      if (!result) {
        console.error(
          `[UseCase] 프로필 업데이트 실패 - Repository 업데이트 실패 - ID: ${id}`
        );
        throw new ValidationError('프로필 업데이트에 실패했습니다.');
      }

      console.log(
        `[UseCase] 프로필 업데이트 성공 - ID: ${id}`,
        result.toJSON()
      );
      return result;
    } catch (error) {
      console.error(
        `[UseCase] 프로필 업데이트 중 오류 발생 - ID: ${id}`,
        error
      );
      throw error;
    }
  }
}