export interface HourlyRecord {
  id: string;
  production_id: string;
  timestamp: string;
  status: 'produzindo' | 'sendo separado' | 'parado' | 'finalizado';
  notes?: string;
  quantity_produced: number;
  temperature?: number;
  pressure?: number;
  operator_id: string;
}
