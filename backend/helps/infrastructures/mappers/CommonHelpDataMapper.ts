//Help Entity와 동일함.
export interface HelpData {
  id: number;
  senior_id: string; // UUID로 변경
  title: string;
  start_date: string;
  end_date: string;
  category: number[];
  content: string;
  status: string;
  created_at: string;
}
