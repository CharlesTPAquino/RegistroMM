import React, { useState } from 'react';
import { Product } from '../types/Product';
import { 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Stack,
  InputAdornment,
  Typography,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { format } from 'date-fns';

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  onSubmit: (product: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
}

const productTypes = [
  'Gel Construtor',
  'Capa Base Flex',
  'Capa Base Estrutural',
  'TopCoat',
  'TopCoat Shine',
  'Gel Gummy',
  'Banho de Fibra',
  'Gel Shine'
];

export function ProductForm({ initialProduct, onSubmit, onCancel }: ProductFormProps) {
  const isEditing = Boolean(initialProduct?.id);
  
  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct || {
      name: '',
      code: '',
      active: true,
      category: '',
      stock: 0,
      price: 0,
      type: undefined,
      batch_number: `LOTE-${format(new Date(), 'yyyy-MM')}-`,
      manufacturing_date: format(new Date(), 'yyyy-MM-dd'),
      order_number: `OP-${format(new Date(), 'yyyy-MM')}-`
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!name) return;

    setProduct(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (!name) return;

    setProduct(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário selecionar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setProduct(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!product.name?.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }
    
    if (!product.code?.trim()) {
      newErrors.code = 'Código do produto é obrigatório';
    }
    
    if (!product.category?.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!product.type) {
      newErrors.type = 'Tipo de produto é obrigatório';
    }
    
    if (!product.batch_number?.trim()) {
      newErrors.batch_number = 'Número do lote é obrigatório';
    }
    
    if (!product.order_number?.trim()) {
      newErrors.order_number = 'Número da OP é obrigatório';
    }
    
    if (!product.manufacturing_date) {
      newErrors.manufacturing_date = 'Data de fabricação é obrigatória';
    }
    
    if (product.price === undefined || product.price < 0) {
      newErrors.price = 'Preço deve ser maior ou igual a zero';
    }
    
    if (product.stock === undefined || product.stock < 0) {
      newErrors.stock = 'Estoque deve ser maior ou igual a zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(product);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Erro ao salvar produto'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Nome do Produto"
              name="name"
              value={product.name || ''}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={isSubmitting}
              required
            />
            <TextField
              fullWidth
              label="Código"
              name="code"
              value={product.code || ''}
              onChange={handleChange}
              error={Boolean(errors.code)}
              helperText={errors.code}
              disabled={isSubmitting}
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth error={Boolean(errors.type)} required>
              <InputLabel>Tipo de Produto</InputLabel>
              <Select
                name="type"
                value={product.type || ''}
                onChange={handleSelectChange}
                label="Tipo de Produto"
                disabled={isSubmitting}
              >
                {productTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
            
            <TextField
              fullWidth
              label="Categoria"
              name="category"
              value={product.category || ''}
              onChange={handleChange}
              error={Boolean(errors.category)}
              helperText={errors.category}
              disabled={isSubmitting}
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Número do Lote"
              name="batch_number"
              value={product.batch_number || ''}
              onChange={handleChange}
              error={Boolean(errors.batch_number)}
              helperText={errors.batch_number}
              disabled={isSubmitting}
              required
            />
            <TextField
              fullWidth
              label="Número da OP"
              name="order_number"
              value={product.order_number || ''}
              onChange={handleChange}
              error={Boolean(errors.order_number)}
              helperText={errors.order_number}
              disabled={isSubmitting}
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Data de Fabricação"
              name="manufacturing_date"
              type="date"
              value={product.manufacturing_date || ''}
              onChange={handleChange}
              error={Boolean(errors.manufacturing_date)}
              helperText={errors.manufacturing_date}
              disabled={isSubmitting}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Estoque"
              name="stock"
              type="number"
              value={product.stock || 0}
              onChange={handleNumberChange}
              error={Boolean(errors.stock)}
              helperText={errors.stock}
              disabled={isSubmitting}
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: <InputAdornment position="end">unidades</InputAdornment>,
              }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Preço"
              name="price"
              type="number"
              value={product.price || 0}
              onChange={handleNumberChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              disabled={isSubmitting}
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
            <Box sx={{ width: '100%' }} />
          </Stack>

          {errors.form && (
            <Typography color="error" variant="body2">
              {errors.form}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel && (
              <Button 
                variant="outlined" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
            >
              {isSubmitting 
                ? (isEditing ? 'Salvando...' : 'Adicionando...') 
                : (isEditing ? 'Salvar Produto' : 'Adicionar Produto')
              }
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
