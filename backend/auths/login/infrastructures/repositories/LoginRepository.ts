import { supabase } from '@/backend/common/utils/supabaseClient';
import { LoginMapper } from '@/backend/auths/login/infrastructures/mappers/LoginMapper';
import { LoginEntity } from '@/backend/auths/login/domains/entities/LoginEntity';
import { LoginRepositoryInterface } from '@/backend/auths/login/domains/repository/LoginRepositoryInterface';

// 로그인에 필요한 사용자 정보를 가져오는 Repository
export class LoginRepository implements LoginRepositoryInterface {
  // loginId는 phoneNumber(숫자) 또는 email(문자열)로 들어올 수 있음
  async findUserByLoginId(loginId: string): Promise<LoginEntity | null> {
    // 골뱅이 여부
    const isPhone = !loginId.includes('@');
    const column = isPhone ? 'phone_number' : 'email';
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq(column, loginId)
      .single();
    if (error || !data) return null;

    return LoginMapper.toLoginEntity({
      id: data.id,
      uuid: data.uuid,
      name: data.name,
      email: data.email,
      phoneNumber: data.phone_number,
      age: data.age,
      address: data.address,
      profileImgUrl: data.profile_img_url,
      password: data.password,
      createdAt: data.created_at,
    });
  }
}
