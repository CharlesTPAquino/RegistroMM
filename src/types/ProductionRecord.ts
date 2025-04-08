export interface ProductionRecord {
  id: string;
  employee_id: string;
  product_id: string;
  order_number: string;
  batch_number: string;
  status: 'produzindo' | 'sendo separado' | 'parado' | 'finalizado';
  start_time: string;
  end_time?: string;
  quantity: number;
  observations?: string;
}
