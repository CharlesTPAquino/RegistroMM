import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Employee, Product, ProductionRecord } from '../types';

export function useProduction() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para carregar os dados
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [employeesData, productsData, recordsData] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('products').select('*'),
        supabase.from('production_records').select('*')
      ]);

      if (employeesData.error) throw employeesData.error;
      if (productsData.error) throw productsData.error;
      if (recordsData.error) throw recordsData.error;

      setEmployees(employeesData.data);
      setProducts(productsData.data);
      setRecords(recordsData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  // Função para criar um novo produto
  const createProduct = async (name: string) => {
    try {
      setError('');
      const { data, error } = await supabase
        .from('products')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      setProducts([...products, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Função para criar um novo funcionário
  const createEmployee = async (data: { name: string; email: string; role: string }) => {
    try {
      setError('');
      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setEmployees([...employees, newEmployee]);
      return newEmployee;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Função para iniciar uma nova produção
  const startProduction = async () => {
    try {
      setError('');
      if (!selectedEmployee || !selectedProduct) {
        throw new Error('Selecione um funcionário e um produto');
      }

      const { data, error } = await supabase
        .from('production_records')
        .insert([{
          employee_id: selectedEmployee.id,
          product_id: selectedProduct.id,
          order_number: orderNumber,
          batch_number: batchNumber,
          production_date: productionDate,
          status: 'Em andamento',
          start_time: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setRecords([...records, data]);

      // Limpar formulário
      setSelectedEmployee(null);
      setSelectedProduct(null);
      setOrderNumber('');
      setBatchNumber('');
      setProductionDate(new Date().toISOString().split('T')[0]);

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Função para atualizar o status de uma produção
  const updateProductionStatus = async (id: string, status: string) => {
    try {
      setError('');
      const { data, error } = await supabase
        .from('production_records')
        .update({
          status,
          ...(status === 'Concluído' ? { completion_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRecords(records.map(record => record.id === id ? data : record));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return {
    employees,
    products,
    records,
    selectedEmployee,
    selectedProduct,
    orderNumber,
    batchNumber,
    productionDate,
    loading,
    error,
    setSelectedEmployee,
    setSelectedProduct,
    setOrderNumber,
    setBatchNumber,
    setProductionDate,
    startProduction,
    updateProductionStatus,
    createProduct,
    createEmployee,
    reloadData: loadData
  };
}
