/** @jsxImportSource react */
import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Divider,
  Paper,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { motion } from 'framer-motion';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Grid as CustomGrid } from '../../components/CustomGrid';

// Importando os tipos
import { Product } from '../../types/Product';
import { RawMaterial } from '../../types/RawMaterial';

// Componentes com animação
const MotionCard = motion(Card);

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Interface para as propriedades do componente
interface InventoryTabProps {
  products: Product[];
  rawMaterials: RawMaterial[];
}

export function InventoryTab({ 
  products, 
  rawMaterials
}: InventoryTabProps) {
  const theme = useTheme();
  const [productPage, setProductPage] = useState(0);
  const [productRowsPerPage, setProductRowsPerPage] = useState(5);
  const [materialPage, setMaterialPage] = useState(0);
  const [materialRowsPerPage, setMaterialRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');

  // Função para verificar o status da validade
  const getExpirationStatus = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', color: 'error', label: 'Vencido' };
    } else if (diffDays < 30) {
      return { status: 'expiring', color: 'warning', label: 'Próximo do vencimento' };
    } else {
      return { status: 'valid', color: 'success', label: 'Válido' };
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  // Matérias primas filtradas
  const filteredMaterials = useMemo(() => {
    let filtered = rawMaterials.filter(material => 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.supplier && material.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (materialFilter !== 'all') {
      filtered = filtered.filter(material => {
        const { status } = getExpirationStatus(material.expiration_date);
        return status === materialFilter;
      });
    }
    
    return filtered;
  }, [rawMaterials, searchTerm, materialFilter]);

  // Estatísticas de estoque
  const inventoryStats = useMemo(() => {
    const totalProductStock = products.reduce((sum, product) => sum + product.stock, 0);
    const lowStockProducts = products.filter(product => product.stock < 10).length;
    
    const totalMaterialStock = rawMaterials.reduce((sum, material) => sum + material.quantity, 0);
    const lowStockMaterials = rawMaterials.filter(material => material.quantity < 20).length;
    
    const expiredMaterials = rawMaterials.filter(material => {
      const { status } = getExpirationStatus(material.expiration_date);
      return status === 'expired';
    }).length;
    
    const expiringMaterials = rawMaterials.filter(material => {
      const { status } = getExpirationStatus(material.expiration_date);
      return status === 'expiring';
    }).length;
    
    return {
      totalProductStock,
      lowStockProducts,
      totalMaterialStock,
      lowStockMaterials,
      expiredMaterials,
      expiringMaterials
    };
  }, [products, rawMaterials]);

  // Dados para o gráfico de estoque por tipo de produto
  const stockByTypeData = useMemo(() => {
    const typeGroups = products.reduce((groups, product) => {
      const type = product.type || 'Sem tipo';
      if (!groups[type]) {
        groups[type] = 0;
      }
      groups[type] += product.stock;
      return groups;
    }, {} as Record<string, number>);
    
    return Object.entries(typeGroups).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Dados para o gráfico de matérias primas por status de validade
  const materialsByExpirationData = useMemo(() => {
    const expired = rawMaterials.filter(material => {
      const { status } = getExpirationStatus(material.expiration_date);
      return status === 'expired';
    }).length;
    
    const expiring = rawMaterials.filter(material => {
      const { status } = getExpirationStatus(material.expiration_date);
      return status === 'expiring';
    }).length;
    
    const valid = rawMaterials.filter(material => {
      const { status } = getExpirationStatus(material.expiration_date);
      return status === 'valid';
    }).length;
    
    return [
      { name: 'Válidos', value: valid },
      { name: 'Próx. Vencimento', value: expiring },
      { name: 'Vencidos', value: expired }
    ];
  }, [rawMaterials]);

  // Manipuladores de paginação para produtos
  const handleProductChangePage = (_event: unknown, newPage: number) => {
    setProductPage(newPage);
  };

  const handleProductChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductRowsPerPage(parseInt(event.target.value, 10));
    setProductPage(0);
  };

  // Manipuladores de paginação para matérias primas
  const handleMaterialChangePage = (_event: unknown, newPage: number) => {
    setMaterialPage(newPage);
  };

  const handleMaterialChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaterialRowsPerPage(parseInt(event.target.value, 10));
    setMaterialPage(0);
  };

  // Manipulador de busca
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setProductPage(0);
    setMaterialPage(0);
  };

  // Manipulador de filtro de matérias primas
  const handleMaterialFilterChange = (event: SelectChangeEvent) => {
    setMaterialFilter(event.target.value);
    setMaterialPage(0);
  };

  // Animações
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <Box>
      {/* Barra de busca e filtros */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '16px',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          label="Buscar no estoque"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="material-filter-label">Filtrar por validade</InputLabel>
          <Select
            labelId="material-filter-label"
            id="material-filter"
            value={materialFilter}
            label="Filtrar por validade"
            onChange={handleMaterialFilterChange}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="valid">Válidos</MenuItem>
            <MenuItem value="expiring">Próximos do vencimento</MenuItem>
            <MenuItem value="expired">Vencidos</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Cards de estatísticas */}
      <CustomGrid container spacing={3} sx={{ mb: 4 }}>
        <CustomGrid item xs={12} sm={6} md={3}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Produtos em Estoque
              </Typography>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {inventoryStats.totalProductStock}
              </Typography>
              <Chip 
                icon={<InventoryIcon />} 
                label="Unidades" 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MotionCard>
        </CustomGrid>
        
        <CustomGrid item xs={12} sm={6} md={3}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Matérias Primas
              </Typography>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {inventoryStats.totalMaterialStock.toFixed(1)}
              </Typography>
              <Chip 
                icon={<InventoryIcon />} 
                label="Kg" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MotionCard>
        </CustomGrid>
        
        <CustomGrid item xs={12} sm={6} md={3}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Estoque Baixo
              </Typography>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                {inventoryStats.lowStockProducts + inventoryStats.lowStockMaterials}
              </Typography>
              <Chip 
                icon={<WarningIcon />} 
                label="Itens" 
                color="warning" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MotionCard>
        </CustomGrid>
        
        <CustomGrid item xs={12} sm={6} md={3}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Vencidos/Próx. Vencimento
              </Typography>
              <Typography variant="h3" color="error.main" fontWeight="bold">
                {inventoryStats.expiredMaterials + inventoryStats.expiringMaterials}
              </Typography>
              <Chip 
                icon={<ErrorIcon />} 
                label="Matérias Primas" 
                color="error" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MotionCard>
        </CustomGrid>
      </CustomGrid>

      {/* Gráficos */}
      <CustomGrid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Estoque por Tipo de Produto */}
        <CustomGrid item xs={12} md={6}>
          <MotionCard
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estoque por Tipo de Produto
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stockByTypeData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [`${value} unidades`, 'Quantidade']} />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade em Estoque" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>
        </CustomGrid>

        {/* Gráfico de Matérias Primas por Status de Validade */}
        <CustomGrid item xs={12} md={6}>
          <MotionCard
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={5}
            sx={{ borderRadius: '16px' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Matérias Primas por Status de Validade
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialsByExpirationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materialsByExpirationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => [`${value} itens`, 'Quantidade']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>
        </CustomGrid>
      </CustomGrid>

      {/* Tabela de Produtos */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={6}
        sx={{ borderRadius: '16px', mb: 4 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Produtos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(productPage * productRowsPerPage, productPage * productRowsPerPage + productRowsPerPage)
                  .map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.code || '-'}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.type || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {product.stock}
                          </Typography>
                          {product.stock < 10 && (
                            <Tooltip title="Estoque baixo">
                              <WarningIcon fontSize="small" color="warning" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.active ? 'Ativo' : 'Inativo'} 
                          color={product.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={productRowsPerPage}
            page={productPage}
            onPageChange={handleProductChangePage}
            onRowsPerPageChange={handleProductChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </MotionCard>

      {/* Tabela de Matérias Primas */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={7}
        sx={{ borderRadius: '16px' }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Matérias Primas
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de matérias primas">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Quantidade (Kg)</TableCell>
                  <TableCell>Lote</TableCell>
                  <TableCell>Validade</TableCell>
                  <TableCell>Fornecedor</TableCell>
                  <TableCell>Localização</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMaterials
                  .slice(materialPage * materialRowsPerPage, materialPage * materialRowsPerPage + materialRowsPerPage)
                  .map((material) => {
                    const expirationInfo = getExpirationStatus(material.expiration_date);
                    
                    return (
                      <TableRow
                        key={material.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {material.name}
                        </TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {material.quantity.toFixed(1)}
                            </Typography>
                            {material.quantity < 20 && (
                              <Tooltip title="Estoque baixo">
                                <WarningIcon fontSize="small" color="warning" />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{material.batch_number}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {formatDate(material.expiration_date)}
                            <Chip 
                              label={expirationInfo.label} 
                              color={expirationInfo.color as any}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{material.supplier || '-'}</TableCell>
                        <TableCell>{material.storage_location || '-'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver detalhes">
                            <IconButton size="small">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredMaterials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nenhuma matéria prima encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredMaterials.length}
            rowsPerPage={materialRowsPerPage}
            page={materialPage}
            onPageChange={handleMaterialChangePage}
            onRowsPerPageChange={handleMaterialChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </MotionCard>
    </Box>
  );
}
