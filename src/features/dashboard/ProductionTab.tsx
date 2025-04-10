/** @jsxImportSource react */
import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar, 
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
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import FactoryIcon from '@mui/icons-material/Factory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Importando os tipos
import { Product } from '../../types/Product';
import { ProductionRecord } from '../../types/ProductionRecord';
import { HourlyRecord } from '../../types/HourlyRecord';

// Componentes com animação
const MotionCard = motion(Card);

// Interface para as propriedades do componente
interface ProductionTabProps {
  products: Product[];
  productionRecords: ProductionRecord[];
  hourlyRecords: HourlyRecord[];
}

import { Grid as CustomGrid } from '../../components/CustomGrid';

export function ProductionTab({ 
  products, 
  productionRecords, 
  hourlyRecords 
}: ProductionTabProps) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Função para obter o nome do produto pelo ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para calcular a duração da produção
  const calculateDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}min`;
  };

  // Função para obter a cor do chip com base no status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'produzindo':
        return 'success';
      case 'sendo separado':
        return 'info';
      case 'parado':
        return 'error';
      case 'finalizado':
        return 'default';
      default:
        return 'primary';
    }
  };

  // Dados para o gráfico de produção por dia
  const productionByDayData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const data = last7Days.map(day => {
      const dayRecords = hourlyRecords.filter(record => 
        record.timestamp.split('T')[0] === day
      );
      
      const totalProduced = dayRecords.reduce((sum, record) => 
        sum + record.quantity_produced, 0
      );
      
      return {
        date: new Date(day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        quantidade: totalProduced
      };
    });
    
    return data;
  }, [hourlyRecords]);

  // Dados para o gráfico de temperatura e pressão
  const temperaturePressureData = useMemo(() => {
    // Agrupar por hora (últimas 24 horas)
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i);
      return date.toISOString().split(':')[0] + ':00:00Z';
    }).reverse();
    
    const data = last24Hours.map(hour => {
      const hourStart = new Date(hour);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);
      
      const hourRecords = hourlyRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= hourStart && recordDate < hourEnd;
      });
      
      const avgTemperature = hourRecords.length > 0
        ? hourRecords.reduce((sum, record) => sum + (record.temperature || 0), 0) / hourRecords.length
        : null;
      
      const avgPressure = hourRecords.length > 0
        ? hourRecords.reduce((sum, record) => sum + (record.pressure || 0), 0) / hourRecords.length
        : null;
      
      return {
        hora: hourStart.toLocaleTimeString('pt-BR', { hour: '2-digit' }),
        temperatura: avgTemperature ? parseFloat(avgTemperature.toFixed(1)) : null,
        pressao: avgPressure ? parseFloat(avgPressure.toFixed(2)) : null
      };
    });
    
    // Filtrar horas sem dados
    return data.filter(item => item.temperatura !== null || item.pressao !== null);
  }, [hourlyRecords]);

  // Estatísticas de produção
  const productionStats = useMemo(() => {
    const activeProductions = productionRecords.filter(p => 
      p.status === 'produzindo' || p.status === 'sendo separado'
    ).length;
    
    const completedProductions = productionRecords.filter(p => 
      p.status === 'finalizado'
    ).length;
    
    const totalQuantity = productionRecords.reduce((sum, record) => 
      sum + record.quantity, 0
    );
    
    const avgProductionTime = productionRecords
      .filter(p => p.end_time)
      .map(p => {
        const start = new Date(p.start_time);
        const end = new Date(p.end_time!);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // horas
      });
    
    const averageTime = avgProductionTime.length > 0
      ? avgProductionTime.reduce((sum, time) => sum + time, 0) / avgProductionTime.length
      : 0;
    
    return {
      activeProductions,
      completedProductions,
      totalQuantity,
      averageTime: averageTime.toFixed(1)
    };
  }, [productionRecords]);

  // Manipuladores de paginação
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                Produções Ativas
              </Typography>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {productionStats.activeProductions}
              </Typography>
              <Chip 
                icon={<FactoryIcon />} 
                label="Em andamento" 
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
                Produções Concluídas
              </Typography>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {productionStats.completedProductions}
              </Typography>
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Finalizadas" 
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
                Quantidade Total
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {productionStats.totalQuantity}
              </Typography>
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Unidades" 
                color="info" 
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
                Tempo Médio
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {productionStats.averageTime}h
              </Typography>
              <Chip 
                icon={<TrendingDownIcon />} 
                label="Por produção" 
                color="secondary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </MotionCard>
        </CustomGrid>
      </CustomGrid>

      {/* Gráficos */}
      <CustomGrid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Produção por Dia */}
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
                Produção Diária (Últimos 7 dias)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={productionByDayData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: any) => [`${value} unidades`, 'Quantidade']} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="quantidade" 
                      name="Quantidade Produzida" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>
        </CustomGrid>

        {/* Gráfico de Temperatura e Pressão */}
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
                Temperatura e Pressão (Últimas 24 horas)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={temperaturePressureData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperatura"
                      name="Temperatura (°C)"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="pressao" 
                      name="Pressão (bar)" 
                      stroke="#387908" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </MotionCard>
        </CustomGrid>
      </CustomGrid>

      {/* Tabela de Produções Recentes */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={6}
        sx={{ borderRadius: '16px' }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Produções Recentes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de produções">
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell>Lote</TableCell>
                  <TableCell>Ordem</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Início</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productionRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <TableRow
                      key={record.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {getProductName(record.product_id)}
                      </TableCell>
                      <TableCell>{record.batch_number}</TableCell>
                      <TableCell>{record.order_number}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.status} 
                          color={getStatusColor(record.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(record.start_time)}</TableCell>
                      <TableCell>{calculateDuration(record.start_time, record.end_time)}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalhes">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productionRecords.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </CardContent>
      </MotionCard>
    </Box>
  );
}
