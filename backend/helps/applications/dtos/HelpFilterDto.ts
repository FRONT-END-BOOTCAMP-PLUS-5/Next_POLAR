export interface HelpFilterDto {
  id?: number; // 특정 헬프 ID
  categoryIds?: number[]; // 메인 카테고리 ID 배열 (categories 테이블)
  subCategoryIds?: number[]; // 서브 카테고리 ID 배열 (sub_categories 테이블)
  startDate?: string; // 시작 날짜 (ISO string)
  endDate?: string; // 종료 날짜 (ISO string)
  status?: string; // 상태 필터
  page?: number; // 현재 페이지 (1부터 시작)
  limit?: number; // 페이지 크기
  offset?: number; // 페이지 오프셋
}
