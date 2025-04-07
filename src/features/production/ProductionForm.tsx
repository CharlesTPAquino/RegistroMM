import React from 'react';
import { Box, TextField } from '@mui/material';
import { Select } from '../../components/forms/Select';
import { SaveButton } from '../../components/buttons/SaveButton';
import { ProductionRecord } from '../../types/ProductionRecord';
import { Employee } from '../../types/Employee';
import { Product } from '../../types/Product';

interface ProductionFormProps {
  record: Partial<ProductionRecord>;
  employees: Employee[];
  products: Product[];
  loading: boolean;
  onSubmit: (data: Partial<ProductionRecord>) => void;
  onChange: (field: keyof ProductionRecord, value: any) => void;
}

export const ProductionForm: React.FC<ProductionFormProps> = ({
  record,
  employees,
  products,
  loading,
  onSubmit,
  onChange
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(record);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <TextField
            fullWidth
            label="Número da Ordem"
            value={record.order_number || ''}
            onChange={(e) => onChange('order_number', e.target.value)}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Número do Lote"
            value={record.batch_number || ''}
            onChange={(e) => onChange('batch_number', e.target.value)}
            required
          />
        </Box>
        <Box>
          <Select
            label="Funcionário"
            value={record.employee_id || ''}
            onChange={(e) => onChange('employee_id', e.target.value)}
            options={employees.map(emp => ({
              value: emp.id,
              label: emp.name
            }))}
            required
          />
        </Box>
        <Box>
          <Select
            label="Produto"
            value={record.product_id || ''}
            onChange={(e) => onChange('product_id', e.target.value)}
            options={products.map(prod => ({
              value: prod.id,
              label: prod.name
            }))}
            required
          />
        </Box>
        <Box>
          <Select
            label="Status"
            value={record.status || ''}
            onChange={(e) => onChange('status', e.target.value)}
            options={[
              { value: 'produzindo', label: 'Produzindo' },
              { value: 'sendo separado', label: 'Sendo Separado' },
              { value: 'parado', label: 'Parado' },
              { value: 'finalizado', label: 'Finalizado' }
            ]}
            required
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
          <SaveButton
            loading={loading}
            actionText={record.id ? 'Atualizar' : 'Criar'}
            type="submit"
            fullWidth
          />
        </Box>
      </Box>
    </form>
  );
};
