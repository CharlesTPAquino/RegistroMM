export interface ProductionRecord {
  id: string;
  employee_id: string;
  product_id: string;
  order_number: string;
  batch_number: string;
  status: 'produzindo' | 'sendo separado' | 'parado' | 'finalizado';
  created_at?: string;
  employees?: { name: string };
  products?: { name: string };
  employee_name?: string;
  product_name?: string;
}
