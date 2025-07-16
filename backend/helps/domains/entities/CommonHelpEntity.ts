// helps 리스트와 상세를 조회 하는 엔티티
// 이 파일에는 helps 리스트와 상세를 조회 하는 도메인 엔티티들이 정의됩니다.

// 예시:
// - Help: helps 리스트 정보
// - HelpDetail: help의 상세 데이터 정보

// 도메인 엔티티는 비즈니스 규칙을 포함하며, 외부 의존성이 없는 순수한 객체여야 합니다.

export class CommonHelpEntity {
  constructor(
    public id: number,
    public seniorId: string, // UUID로 변경
    public title: string,
    public startDate: Date,
    public endDate: Date,
    public category: number[], // 여러 카테고리를 지원하도록 배열로 변경
    public content: string,
    public status: string,
    public createdAt: Date
  ) {}

  toJSON() {
    return {
      id: this.id,
      seniorId: this.seniorId,
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      category: this.category,
      content: this.content,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
