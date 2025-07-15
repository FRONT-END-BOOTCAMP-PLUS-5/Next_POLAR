export class SeniorHelp {
  constructor(
    public title: string,
    public startDate: string,
    public content: string,
    public category: number | number[],
    public endDate?: string,
    public seniorId?: string, // UUID로 변경
    public id?: number,
    public status?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public imageFiles?: string[] // 이미지 URL 배열 추가
  ) {}
}
