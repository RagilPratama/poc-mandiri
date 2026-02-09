export interface Menu {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  is_available?: boolean;
  created_at?: Date;
  updated_at?: Date;
}