import { NextRequest, NextResponse } from 'next/server';
import { SbHelpApplicantRepository } from '@/backend/helps/infrastructures/repositories/SbHelpApplicantRepository';
import { GetHelpApplicantsUseCase } from '@/backend/helps/applications/usecases/GetHelpApplicantsUseCase';
import {
  HelpApplicantDto,
  HelpApplicantsResponseDto,
} from '@/backend/helps/applications/dtos/HelpApplicantDto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ helpId: number }> }
) {
  try {
    const { helpId } = await params;
    if (!helpId)
      return NextResponse.json({ error: 'helpId 필요' }, { status: 400 });

    const repo = new SbHelpApplicantRepository();
    const usecase = new GetHelpApplicantsUseCase(repo);
    const applicants = await usecase.execute(helpId);

    // 엔티티를 DTO로 변환
    const applicantsWithNicknames: HelpApplicantDto[] = await Promise.all(
      applicants.map(async (applicant) => {
        return {
          id: applicant.id,
          helpId: applicant.helpId,
          juniorNickname: applicant.juniorNickname || '알 수 없음',
          isAccepted: applicant.isAccepted,
          appliedAt: applicant.appliedAt.toString(),
        };
      })
    );

    const response: HelpApplicantsResponseDto = {
      success: true,
      applicants: applicantsWithNicknames,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error('Help 지원자 리스트 조회 오류:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
