import React from 'react';
import { Employee } from '../types/Employee';
import { Product } from '../types/Product';
import { PlayCircleIcon } from '@heroicons/react/24/outline';

interface ProductionFormProps {
  employees: Employee[];
  products: Product[];
  selectedEmployee: Employee | null;
  selectedProduct: Product | null;
  orderNumber: string;
  batchNumber: string;
  productionDate: string;
  loading: boolean;
  onEmployeeChange: (employee: Employee | null) => void;
  onProductChange: (product: Product | null) => void;
  onOrderNumberChange: (value: string) => void;
  onBatchNumberChange: (value: string) => void;
  onProductionDateChange: (value: string) => void;
  onSubmit: () => void;
}

export function ProductionForm({
  employees,
  products,
  selectedEmployee,
  selectedProduct,
  orderNumber,
  batchNumber,
  productionDate,
  loading,
  onEmployeeChange,
  onProductChange,
  onOrderNumberChange,
  onBatchNumberChange,
  onProductionDateChange,
  onSubmit
}: ProductionFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const inputClassName = "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="employee" className={labelClassName}>
            Funcionário
          </label>
          <select
            id="employee"
            value={selectedEmployee?.id || ''}
            onChange={(e) => {
              const employee = employees.find(emp => emp.id === e.target.value) || null;
              onEmployeeChange(employee);
            }}
            className={inputClassName}
            required
          >
            <option value="">Selecione um funcionário</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product" className={labelClassName}>
            Produto
          </label>
          <select
            id="product"
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const product = products.find(prod => prod.id === e.target.value) || null;
              onProductChange(product);
            }}
            className={inputClassName}
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="orderNumber" className={labelClassName}>
            Número do Pedido
          </label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => onOrderNumberChange(e.target.value)}
            className={inputClassName}
            placeholder="Digite o número do pedido"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="batchNumber" className={labelClassName}>
            Número do Lote
          </label>
          <input
            type="text"
            id="batchNumber"
            value={batchNumber}
            onChange={(e) => onBatchNumberChange(e.target.value)}
            className={inputClassName}
            placeholder="Digite o número do lote"
            required
          />
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="productionDate" className={labelClassName}>
            Data de Produção
          </label>
          <input
            type="date"
            id="productionDate"
            value={productionDate}
            onChange={(e) => onProductionDateChange(e.target.value)}
            className={inputClassName}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Iniciando...' : (
          <React.Fragment>
            <PlayCircleIcon 
              className="w-5 h-5"
              aria-label="Ícone de Iniciar"
              role="img"
            />
            Iniciar Produção
          </React.Fragment>
        )}
      </button>
    </form>
  );
}
