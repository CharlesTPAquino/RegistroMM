import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import { Employee } from '../../types/Employee';
import { Product } from '../../types/Product';
import { ProductionRecord } from '../../types/ProductionRecord';

interface ProductionFormProps {
  record?: Partial<ProductionRecord>;
  employees?: Employee[];
  products?: Product[];
  loading?: boolean;
  onSubmit?: (data: Partial<ProductionRecord>) => void;
  onChange?: (field: keyof ProductionRecord, value: any) => void;
}

export const ProductionForm: React.FC<ProductionFormProps> = ({
  record = {},
  // Removendo as variáveis não utilizadas dos parâmetros
  // employees = [],
  // products = [],
  loading = false,
  onSubmit = () => console.log('Form submitted'),
  // onChange = () => {}
}) => {
  const [localRecord, setLocalRecord] = useState<Partial<ProductionRecord>>(record);
  const [localLoading] = useState<boolean>(loading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', localRecord);
    onSubmit(localRecord);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <TextField
            fullWidth
            label="Número da Ordem"
            value={localRecord.order_number || ''}
            onChange={(e) => setLocalRecord({ ...localRecord, order_number: e.target.value })}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Número do Lote"
            value={localRecord.batch_number || ''}
            onChange={(e) => setLocalRecord({ ...localRecord, batch_number: e.target.value })}
            required
          />
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Funcionário</InputLabel>
            <Select
              value={localRecord.employee_id || ''}
              onChange={(e) => setLocalRecord({ ...localRecord, employee_id: e.target.value })}
              label="Funcionário"
            >
              <MenuItem value="1">Funcionário 1</MenuItem>
              <MenuItem value="2">Funcionário 2</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Produto</InputLabel>
            <Select
              value={localRecord.product_id || ''}
              onChange={(e) => setLocalRecord({ ...localRecord, product_id: e.target.value })}
              label="Produto"
            >
              <MenuItem value="1">Produto 1</MenuItem>
              <MenuItem value="2">Produto 2</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={localRecord.status || ''}
              onChange={(e) => setLocalRecord({ ...localRecord, status: e.target.value as ProductionRecord['status'] })}
              label="Status"
            >
              <MenuItem value="produzindo">Produzindo</MenuItem>
              <MenuItem value="sendo separado">Sendo Separado</MenuItem>
              <MenuItem value="parado">Parado</MenuItem>
              <MenuItem value="finalizado">Finalizado</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={localRecord.quantity || ''}
            onChange={(e) => setLocalRecord({ ...localRecord, quantity: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={localLoading}
          >
            {localLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
