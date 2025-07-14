import { NextRequest, NextResponse } from 'next/server';
import { ReviewUseCases } from '@/backend/reviews/applications/usecases/ReviewUseCases';
import { SbReviewRepository } from '@/backend/reviews/infrastructures/repositories/SbReviewRepository';
import { getNicknameByUuid } from '@/lib/getUserName';

const reviewUseCases = new ReviewUseCases(new SbReviewRepository());

// ReviewEntity를 API 응답용 DTO로 변환
async function convertEntityToResponseDto(entity: any) {
  const writerNickname = await getNicknameByUuid(entity.writerId);
  const receiverNickname = await getNicknameByUuid(entity.receiverId);

  if (!writerNickname || !receiverNickname) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }

  return {
    id: entity.id,
    helpId: entity.helpId,
    writerNickname,
    receiverNickname,
    rating: entity.rating,
    text: entity.text,
    reviewImgUrl: entity.reviewImgUrl,
    createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('nickname');
  if (!nickname) {
    return NextResponse.json({ error: 'nickname 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }
  
  try {
    const reviewEntities = await reviewUseCases.getReviewsByReceiverNickname(nickname);
    
    // Entity들을 nickname 포함 DTO로 변환
    const reviews = await Promise.all(
      reviewEntities.map(entity => convertEntityToResponseDto(entity))
    );
    
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error('리뷰 조회 중 오류:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '리뷰 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 