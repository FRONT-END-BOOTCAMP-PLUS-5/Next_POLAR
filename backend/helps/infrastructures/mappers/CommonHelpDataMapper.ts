export interface HelpData {
  id: number;
  senior_id: string; // UUID로 변경
  title: string;
  start_date: string;
  end_date: string;
  category: { id: number; point: number }[];
  content: string;
  status: string;
  created_at: string;
}
