import { supabase } from '../lib/supabase';
import { Employee, Product, ProductionRecord } from '../types';

export const supabaseService = {
  // Funções para Employees
  async getEmployees() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createEmployee(employee: { name: string; email: string; role: string }) {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateEmployee(id: string, updates: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteEmployee(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Funções para Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createProduct(product: { name: string }) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Funções para ProductionRecords
  async getProductionRecords() {
    const { data, error } = await supabase
      .from('production_records')
      .select(`
        *,
        employee:employees(*),
        product:products(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async startProduction(record: {
    employee_id: string;
    product_id: string;
    order_number: string;
    batch_number: string;
    production_date: string;
  }) {
    const { data, error } = await supabase
      .from('production_records')
      .insert([{
        ...record,
        status: 'Em andamento',
        start_time: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProductionStatus(
    id: string,
    status: string,
    completion_date?: string
  ) {
    const { data, error } = await supabase
      .from('production_records')
      .update({
        status,
        ...(completion_date && { completion_date })
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
