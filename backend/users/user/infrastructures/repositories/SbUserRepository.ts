import { supabase } from '@/backend/common/utils/supabaseClient';
import { CommonUserEntity } from '@/backend/users/user/domains/entities/CommonUserEntity';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { fromDbObject } from '@/backend/common/mappers/UserMapper';

// Supabase 인증 Repository 구현체
export class SbUserRepository implements IUserRepository {
  async getUserById(id: string): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 조회 시작 - ID: ${id}`);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 조회 오류:', error);
        return null;
      }

      if (!data) {
        console.log(`[Repository]사용자를 찾을 수 없음 - ID: ${id}`);
        return null;
      }

      console.log(`[Repository] 사용자 데이터 조회 성공 - ID: ${id}`, data);

      // 데이터를 Entity로 변환
      const userEntity = fromDbObject(data);

      console.log(
        `[Repository] Entity 변환 완료 - ID: ${id}`,
        userEntity.toJSON()
      );
      return userEntity;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }

  async getUserByNickname(nickname: string): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 조회 시작 - nickname: ${nickname}`);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nickname', nickname.replace('#', '%23'))
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 조회 오류:', error);
        return null;
      }

      if (!data) {
        console.log(`[Repository] 사용자를 찾을 수 없음 - nickname: ${nickname}`);
        return null;
      }

      console.log(`[Repository] 사용자 데이터 조회 성공 - nickname: ${nickname}`, data);

      // 데이터를 Entity로 변환
      const userEntity = fromDbObject(data);

      console.log(
        `[Repository] Entity 변환 완료 - nickname: ${nickname}`,
        userEntity.toJSON()
      );
      return userEntity;
    } catch (error) {
      console.error('[Repository] 사용자 조회 중 예외 발생:', error);
      return null;
    }
  }

  async updateUser(
    id: string,
    user: CommonUserEntity
  ): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 업데이트 시작 - ID: ${id}`, user.toJSON());

    try {
      // 업데이트할 데이터 준비
      const updateData = {
        phone_number: user.phoneNumber,
        password: user.password,
        email: user.email,
        age: user.age,
        profile_img_url: user.profileImgUrl,
        address: user.address,
        name: user.name,
        nickname: user.nickname,
      };

      console.log(`[Repository] 업데이트 데이터 준비 완료:`, updateData);

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 업데이트 오류:', error);
        return null;
      }

      if (!data) {
        console.log(`[Repository] 업데이트된 사용자 데이터가 없음 - ID: ${id}`);
        return null;
      }

      console.log(`[Repository] 사용자 업데이트 성공 - ID: ${id}`, data);

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      console.log(
        `[Repository] 업데이트된 Entity 변환 완료 - ID: ${id}`,
        updatedEntity.toJSON()
      );
      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 사용자 업데이트 중 예외 발생:', error);
      return null;
    }
  }

  // UserWithdrawalUseCase용 메서드들

  async deleteById(id: string): Promise<void> {
    console.log(`[Repository] 사용자 삭제 시작 - ID: ${id}`);

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);

      if (error) {
        console.error('[Repository] Supabase 사용자 삭제 오류:', error);
        throw new Error(`사용자 삭제 실패: ${error.message}`);
      }

      console.log(`[Repository] 사용자 삭제 성공 - ID: ${id}`);
    } catch (error) {
      console.error('[Repository] 사용자 삭제 중 예외 발생:', error);
      throw error;
    }
  }

  async updateUserPartial(
    id: string,
    updates: Partial<{
      phoneNumber: string;
      password: string;
      email: string;
      age: number;
      profileImgUrl: string | null;
      address: string;
      name: string;
      nickname: string;
    }>
  ): Promise<CommonUserEntity | null> {
    console.log(`[Repository] 사용자 부분 업데이트 시작 - ID: ${id}`, updates);

    try {
      // 업데이트할 데이터 준비 (snake_case로 변환)
      const updateData: any = {};

      if (updates.phoneNumber !== undefined) updateData.phone_number = updates.phoneNumber;
      if (updates.password !== undefined) updateData.password = updates.password;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.age !== undefined) updateData.age = updates.age;
      if (updates.profileImgUrl !== undefined) updateData.profile_img_url = updates.profileImgUrl;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.nickname !== undefined) updateData.nickname = updates.nickname;

      console.log(`[Repository] 부분 업데이트 데이터 준비 완료:`, updateData);

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Repository] Supabase 사용자 부분 업데이트 오류:', error);
        return null;
      }

      if (!data) {
        console.log(`[Repository] 부분 업데이트된 사용자 데이터가 없음 - ID: ${id}`);
        return null;
      }

      console.log(`[Repository] 사용자 부분 업데이트 성공 - ID: ${id}`, data);

      // 업데이트된 데이터를 Entity로 변환하여 반환
      const updatedEntity = fromDbObject(data);

      console.log(
        `[Repository] 부분 업데이트된 Entity 변환 완료 - ID: ${id}`,
        updatedEntity.toJSON()
      );
      return updatedEntity;
    } catch (error) {
      console.error('[Repository] 사용자 부분 업데이트 중 예외 발생:', error);
      return null;
    }
  }
}
