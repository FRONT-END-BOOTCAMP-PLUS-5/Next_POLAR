import { SeniorHelp } from '@/backend/seniors/helps/domains/entities/SeniorHelp';
import { CreateSeniorHelpRequestDto } from '@/backend/seniors/helps/applications/dtos/SeniorRequest';

export class SeniorHelpMapper {
  static toEntity(dto: CreateSeniorHelpRequestDto): SeniorHelp {
    return new SeniorHelp(
      dto.title,
      dto.startDate,
      dto.content ?? '',
      dto.category,
      dto.endDate,
      undefined,
      undefined,
      'open',
      undefined,
      undefined,
      dto.imageFiles ?? []
    );
  }
}
