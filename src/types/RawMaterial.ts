export interface RawMaterial {
  id: string;
  name: string;
  type: string;
  quantity: number; // em Kg
  batch_number: string;
  expiration_date: string; // formato ISO
  supplier?: string;
  storage_location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
