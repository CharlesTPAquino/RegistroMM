import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import { Product } from '../../types/Product';

// Dados de exemplo
const initialProducts: Product[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Medicamento', stock: 150, price: 15.99, active: true },
  { id: '2', name: 'Dipirona 1g', category: 'Medicamento', stock: 120, price: 12.50, active: true },
  { id: '3', name: 'Vitamina C 1g', category: 'Suplemento', stock: 80, price: 25.90, active: true },
  { id: '4', name: 'Protetor Solar FPS 60', category: 'Cosmético', stock: 45, price: 89.90, active: true },
  { id: '5', name: 'Sabonete Facial', category: 'Cosmético', stock: 60, price: 32.50, active: true }
];

export function ProductList() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct({ ...product });
      setIsEditing(true);
    } else {
      setCurrentProduct({ name: '', category: 'Medicamento', stock: 0, price: 0, active: true });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'stock' || name === 'price' ? Number(value) : value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };

  const handleSave = () => {
    if (isEditing) {
      // Atualizar produto existente
      setProducts(products.map(prod => 
        prod.id === currentProduct.id ? { ...prod, ...currentProduct } as Product : prod
      ));
    } else {
      // Adicionar novo produto
      const newProduct: Product = {
        id: String(Date.now()),
        name: currentProduct.name || '',
        category: currentProduct.category || 'Medicamento',
        stock: currentProduct.stock || 0,
        price: currentProduct.price || 0,
        active: currentProduct.active || true
      };
      setProducts([...products, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medicamento':
        return 'primary';
      case 'Suplemento':
        return 'success';
      case 'Cosmético':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Lista de Produtos</Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            sx={{ mr: 1 }}
          >
            {viewMode === 'list' ? 'Visualizar em Grade' : 'Visualizar em Lista'}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenDialog()}
          >
            Adicionar Produto
          </Button>
        </Box>
      </Box>

      {viewMode === 'list' ? (
        <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.category} 
                      color={getCategoryColor(product.category) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenDialog(product)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
          {products.map((product) => (
            <Box 
              key={product.id} 
              sx={{ 
                gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } 
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Chip 
                      label={product.category} 
                      color={getCategoryColor(product.category) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Estoque: {product.stock} unidades
                  </Typography>
                  <Typography variant="h6" color="primary">
                    R$ {product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleOpenDialog(product)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Dialog para adicionar/editar produto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={currentProduct.name || ''}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="category"
                value={currentProduct.category || ''}
                onChange={handleSelectChange}
                label="Categoria"
              >
                <MenuItem value="Medicamento">Medicamento</MenuItem>
                <MenuItem value="Suplemento">Suplemento</MenuItem>
                <MenuItem value="Cosmético">Cosmético</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Estoque"
              name="stock"
              type="number"
              value={currentProduct.stock || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Preço"
              name="price"
              type="number"
              value={currentProduct.price || ''}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <Box component="span" sx={{ mr: 0.5 }}>R$</Box>,
              }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
