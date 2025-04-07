import { ComponentType } from 'react';

/**
 * Representa um funcionário no sistema
 * @interface Employee
 */
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

/**
 * Representa um produto no sistema
 * @interface Product
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Representa um item de navegação
 * @interface NavigationItem
 */
export interface NavigationItem {
  name: string;
  icon: ComponentType<{ className?: string }>;
  className?: string;
  current: boolean;
}

/**
 * Representa um registro de produção
 * @interface ProductionRecord
 * @property {string} id - Identificador único do registro
 * @property {string} product_id - ID do produto sendo produzido
 * @property {string} employee_id - ID do funcionário responsável
 * @property {string} order_number - Número do pedido
 * @property {string} batch_number - Número do lote
 * @property {string} production_date - Data da produção
 * @property {string} start_time - Horário de início
 * @property {string | null} completion_date - Data de conclusão
 * @property {'Em andamento' | 'Pausado' | 'Concluído' | 'Cancelado'} status - Status atual da produção
 * @property {string} created_at - Data de criação do registro
 * @property {string} updated_at - Data de atualização do registro
 */
export interface ProductionRecord {
  id: string;
  employee_id: string;
  product_id: string;
  order_number: string;
  batch_number: string;
  production_date: string;
  status: 'Em andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
  start_time: string;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductionStatus = ProductionRecord['status'];
