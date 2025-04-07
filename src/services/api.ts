import { supabase } from '../lib/supabase';
import { Employee, Product, ProductionRecord, ProductionStatus } from '../types';

/**
 * Serviço para gerenciar operações relacionadas a funcionários
 */
export const employeeService = {
  /**
   * Busca todos os funcionários ativos
   * @returns Promise<Employee[]> Lista de funcionários
   * @throws Error se a operação falhar
   */
  async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      return [];
    }
  },

  /**
   * Cria um novo funcionário
   * @param name Nome do funcionário
   * @returns Promise<Employee> Funcionário criado
   * @throws Error se a operação falhar
   */
  async create(name: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      return null;
    }
  },

  /**
   * Atualiza um funcionário
   * @param id ID do funcionário
   * @param name Novo nome do funcionário
   * @returns Promise<Employee> Funcionário atualizado
   * @throws Error se a operação falhar
   */
  async update(id: string, name: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      return null;
    }
  },

  /**
   * Desativa um funcionário
   * @param id ID do funcionário
   * @throws Error se a operação falhar
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      return false;
    }
  }
};

/**
 * Serviço para gerenciar operações relacionadas a produtos
 */
export const productService = {
  /**
   * Busca todos os produtos ativos
   * @returns Promise<Product[]> Lista de produtos
   * @throws Error se a operação falhar
   */
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  /**
   * Cria um novo produto
   * @param name Nome do produto
   * @returns Promise<Product> Produto criado
   * @throws Error se a operação falhar
   */
  async create(name: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return null;
    }
  },

  /**
   * Atualiza um produto
   * @param id ID do produto
   * @param name Novo nome do produto
   * @returns Promise<Product> Produto atualizado
   * @throws Error se a operação falhar
   */
  async update(id: string, name: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
  },

  /**
   * Desativa um produto
   * @param id ID do produto
   * @throws Error se a operação falhar
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
  }
};

/**
 * Serviço para gerenciar operações relacionadas a registros de produção
 */
export const productionService = {
  /**
   * Busca todos os registros de produção
   * @returns Promise<ProductionRecord[]> Lista de registros de produção
   * @throws Error se a operação falhar
   */
  async getAll(): Promise<ProductionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('production_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar registros de produção:', error);
      return [];
    }
  },

  /**
   * Inicia um novo registro de produção
   * @param record Dados do registro de produção
   * @returns Promise<ProductionRecord> Registro criado
   * @throws Error se a operação falhar
   */
  async create(record: Omit<ProductionRecord, 'id' | 'created_at'>): Promise<ProductionRecord | null> {
    try {
      const { data, error } = await supabase
        .from('production_records')
        .insert({
          employee_id: record.employee_id,
          product_id: record.product_id,
          order_number: record.order_number,
          batch_number: record.batch_number,
          production_date: record.production_date,
          start_time: record.start_time,
          status: record.status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao iniciar produção:', error);
      return null;
    }
  },

  /**
   * Atualiza o status de um registro de produção
   * @param id ID do registro de produção
   * @param status Novo status do registro de produção
   * @param endTime Data e hora de término da produção
   * @returns Promise<ProductionRecord> Registro atualizado
   * @throws Error se a operação falhar
   */
  async updateStatus(id: string, status: ProductionStatus, endTime?: string): Promise<ProductionRecord | null> {
    try {
      const updateData: Partial<ProductionRecord> = { status };
      if (endTime) {
        updateData.end_time = endTime;
      }

      const { data, error } = await supabase
        .from('production_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status da produção:', error);
      return null;
    }
  },

  /**
   * Desativa um registro de produção
   * @param id ID do registro de produção
   * @throws Error se a operação falhar
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('production_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar registro de produção:', error);
      return false;
    }
  }
};

// Funções adicionais para facilitar importação direta
export const fetchEmployees = employeeService.getAll;
export const createEmployee = employeeService.create;
export const updateEmployee = employeeService.update;
export const deleteEmployee = employeeService.delete;

export const fetchProducts = productService.getAll;
export const createProduct = productService.create;
export const updateProduct = productService.update;
export const deleteProduct = productService.delete;

export const fetchProductionRecords = productionService.getAll;
export const startProduction = productionService.create;
export const updateProductionStatus = productionService.updateStatus;
export const deleteProductionRecord = productionService.delete;
