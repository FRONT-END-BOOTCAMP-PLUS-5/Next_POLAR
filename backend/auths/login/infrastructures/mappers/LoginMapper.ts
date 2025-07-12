import { LoginEntity } from '@/backend/auths/login/domains/entities/LoginEntity';

interface LoginUserData {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  address: string;
  profileImgUrl: string;
  password: string;
  createdAt: string;
}

export class LoginMapper {
  static toLoginEntity(userData: LoginUserData): LoginEntity {
    return new LoginEntity(
      userData.id,
      userData.name,
      userData.email,
      userData.phoneNumber,
      userData.age,
      userData.address,
      userData.profileImgUrl,
      userData.password,
      new Date(userData.createdAt),
      userData.uuid
    );
  }
}
