import { supabase } from '@/backend/common/utils/supabaseClient';
import { ReviewMapper } from '@/backend/reviews/infrastructures/mappers/ReviewMapper';
import { IReviewRepository } from '@/backend/reviews/domains/repositories/ReviewRepository';
import { ReviewEntity } from '@/backend/reviews/domains/entities/review';
import { CreateReviewRequest } from '@/backend/reviews/applications/dtos/ReviewDtos';
import { getNicknameByUuid, getUuidByNickname } from '@/lib/getUserData';

export class SbReviewRepository implements IReviewRepository {
  // nickname으로 받은 리뷰 리스트 조회
  async findByReceiverNickname(nickname: string): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('receiver_nickname', nickname)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review: any) => ReviewMapper.toEntity(review));
  }

  // nickname으로 내가 쓴(작성한) 리뷰 리스트 조회
  async findByWriterNickname(nickname: string): Promise<ReviewEntity[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('writer_nickname', nickname)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((review: any) => ReviewMapper.toEntity(review));
  }

  // nickname 기반 리뷰 생성
  async createByNicknames(request: CreateReviewRequest): Promise<ReviewEntity> {
    const { helpId, writerNickname, receiverNickname, rating, text, reviewImgUrl } = request;

    // 1. writerNickname을 users 테이블에서 writerId(uuid)로 변환
    const writerId = await getUuidByNickname(writerNickname);
    if (!writerId) {
      throw new Error('writerId를 찾을 수 없습니다.');
    }

    // 2. receiverNickname이 없으면 에러
    if (!receiverNickname) {
      throw new Error('receiverNickname이 필요합니다.');
    }

    // 3. receiverNickname을 users 테이블에서 receiverId(uuid)로 변환
    const receiverId = await getUuidByNickname(receiverNickname);
    if (!receiverId) {
      throw new Error('receiverId를 찾을 수 없습니다.');
    }

    // 3. writerId, receiverId로 리뷰 저장
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        help_id: helpId,
        writer_id: writerId,
        receiver_id: receiverId,
        writer_nickname: writerNickname,
        receiver_nickname: receiverNickname,
        rating,
        text,
        review_img_url: reviewImgUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('리뷰 생성 실패');

    return ReviewMapper.toEntity(data);
  }



  // 리뷰 상대방 nickname 조회
  async findReceiverNickname(writerNickname: string, helpId: number): Promise<string> {
    // 1. writerNickname을 users 테이블에서 writerId(uuid)로 변환
    const writerId = await getUuidByNickname(writerNickname);
    if (!writerId) {
      throw new Error('writerId를 찾을 수 없습니다.');
    }

    // 2. helps 테이블에서 helpId로 seniorId(uuid) 조회
    const { data: help, error: helpError } = await supabase
      .from('helps')
      .select('senior_id')
      .eq('id', helpId)
      .single();
    if (helpError || !help) {
      throw new Error('헬프의 seniorId를 찾을 수 없습니다.');
    }
    const seniorId = help.senior_id;

    let receiverId: string;
    if (writerId === seniorId) {
      // 3. writer가 senior일 때: help_applicants에서 매칭된 주니어의 uuid(receiverId) 조회
      const { data: applicant, error: applicantError } = await supabase
        .from('help_applicants')
        .select('junior_id')
        .eq('help_id', helpId)
        .eq('is_accepted', true)
        .single();
      if (applicantError || !applicant) {
        throw new Error('help_applicants에서 매칭된 주니어의 uuid를 찾을 수 없습니다.');
      }
      receiverId = applicant.junior_id;
    } else {
      // 4. writer가 junior일 때: seniorId가 receiverId
      receiverId = seniorId;
    }

    // 5. receiverId로 receiverNickname 조회
    const receiverNickname = await getNicknameByUuid(receiverId);
    if (!receiverNickname) {
      throw new Error('receiverNickname을 찾을 수 없습니다.');
    }

    return receiverNickname;
  }
}
