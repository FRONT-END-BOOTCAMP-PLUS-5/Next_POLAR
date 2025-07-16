import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT 시크릿 키가 환경 변수에 설정되지 않았습니다.');
}

export function generateAccessToken(payload: Record<string, unknown>) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('유효하지 않은 페이로드입니다.');
  }
  return jwt.sign(payload, ACCESS_SECRET as string, { expiresIn: '1h' });
}

export function generateRefreshToken(payload: Record<string, unknown>) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('유효하지 않은 페이로드입니다.');
  }
  return jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): Record<string, unknown> {
  try {
    return jwt.verify(token, ACCESS_SECRET as string) as Record<
      string,
      unknown
    >;
  } catch (error: unknown) {
    // JWT 관련 에러 타입 체크
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('유효하지 않은 액세스 토큰입니다.');
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('액세스 토큰이 만료되었습니다.');
    }

    if (error instanceof jwt.NotBeforeError) {
      throw new Error('액세스 토큰이 아직 유효하지 않습니다.');
    }

    // 기타 예상치 못한 에러
    console.error('Access token verification error:', error);
    throw new Error('액세스 토큰 검증 중 오류가 발생했습니다.');
  }
}

export function verifyRefreshToken(token: string): Record<string, unknown> {
  try {
    return jwt.verify(token, REFRESH_SECRET as string) as Record<
      string,
      unknown
    >;
  } catch (error: unknown) {
    // JWT 관련 에러 타입 체크
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('유효하지 않은 리프레시 토큰입니다.');
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('리프레시 토큰이 만료되었습니다.');
    }

    if (error instanceof jwt.NotBeforeError) {
      throw new Error('리프레시 토큰이 아직 유효하지 않습니다.');
    }

    // 기타 예상치 못한 에러
    console.error('Refresh token verification error:', error);
    throw new Error('리프레시 토큰 검증 중 오류가 발생했습니다.');
  }
}

// 쿠키에서 사용자 닉네임을 추출하는 함수
export function getNicknameFromCookie(
  request: NextRequest
): { nickname: string; role: string } | null {
  try {
    // 쿠키에서 access-token 가져오기
    const accessToken = request.cookies.get('access-token')?.value;

    if (!accessToken) {
      console.log('[JWT] access-token 쿠키가 없습니다.');
      return null;
    }

    // JWT 토큰 검증 및 페이로드 추출
    const payload = verifyAccessToken(accessToken);
    const nickname = payload.nickname as string;
    const role = payload.role as string;

    if (!nickname) {
      console.log('[JWT] 토큰에서 nickname을 찾을 수 없습니다.');
      return null;
    }

    console.log(`[JWT] 토큰에서 추출한 닉네임: ${nickname}`);
    return { nickname, role };
  } catch (error: unknown) {
    // 에러 타입 검증
    if (error instanceof Error) {
      console.error('[JWT] 토큰 검증 중 오류:', error.message);
    } else {
      console.error('[JWT] 토큰 검증 중 예상치 못한 오류:', error);
    }
    return null;
  }
}
