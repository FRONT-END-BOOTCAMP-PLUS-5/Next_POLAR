import { supabase } from '@/backend/common/utils/supabaseClient';

export async function getUuidByNickname(
  nickname: string
): Promise<string | null> {
  try {
    console.log(`[getUuidByNickname] 닉네임으로 UUID 검색 시작: ${nickname}`);

    if (!nickname || nickname.trim().length === 0) {
      console.error('[getUuidByNickname] 닉네임이 비어있습니다.');
      return null;
    }

    // Supabase에서 users 테이블의 nickname 컬럼으로 검색 (unique이므로 single 사용)
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116: 결과가 없는 경우
        console.log(
          `[getUuidByNickname] 닉네임 "${nickname}"에 해당하는 사용자를 찾을 수 없습니다.`
        );
        return null;
      }
      console.error('[getUuidByNickname] Supabase 조회 오류:', error);
      return null;
    }

    if (!data) {
      console.log(
        `[getUuidByNickname] 닉네임 "${nickname}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
      return null;
    }

    console.log(`[getUuidByNickname] UUID 검색 성공: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('[getUuidByNickname] 예외 발생:', error);
    return null;
  }
}

export async function getNicknameByUuid(uuid: string): Promise<string | null> {
  try {
    console.log(`[getNicknameByUuid] UUID로 닉네임 검색 시작: ${uuid}`);

    if (!uuid || uuid.trim().length === 0) {
      console.error('[getNicknameByUuid] UUID가 비어있습니다.');
      return null;
    }

    // Supabase에서 users 테이블의 id 컬럼으로 검색 (unique이므로 single 사용)
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', uuid.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116: 결과가 없는 경우
        console.log(
          `[getNicknameByUuid] UUID "${uuid}"에 해당하는 사용자를 찾을 수 없습니다.`
        );
        return null;
      }
      console.error('[getNicknameByUuid] Supabase 조회 오류:', error);
      return null;
    }

    if (!data) {
      console.log(
        `[getNicknameByUuid] UUID "${uuid}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
      return null;
    }

    console.log(`[getNicknameByUuid] 닉네임 검색 성공: ${data.nickname}`);
    return data.nickname;
  } catch (error) {
    console.error('[getNicknameByUuid] 예외 발생:', error);
    return null;
  }
}
