import { IHelpApplicantRepository } from '@/backend/helps/domains/repositories/IHelpApplicantRepository';
import { HelpApplicantDto } from '../dtos/HelpApplicantDto';
import { HelpApplicantMapper } from '../mappers/HelpApplicantMapper';

export class GetHelpApplicantsUseCase {
  constructor(private readonly applicantRepo: IHelpApplicantRepository) {}

  async execute(helpId: number): Promise<HelpApplicantDto[]> {
    const applicants = await this.applicantRepo.getApplicantsByHelpId(helpId);
    return HelpApplicantMapper.toDtoList(applicants);
  }
}
