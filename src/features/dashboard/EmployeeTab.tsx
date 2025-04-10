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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import FactoryIcon from '@mui/icons-material/Factory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

// Importando os tipos
import { Employee } from '../../types/Employee';
import { ProductionRecord } from '../../types/ProductionRecord';

// Componentes com animação
const MotionCard = motion(Card);

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Interface para as propriedades do componente
interface EmployeeTabProps {
  employees: Employee[];
  productionRecords: ProductionRecord[];
}

// Interface para estatísticas de funcionário
interface EmployeeStats {
  activeEmployees: number;
  inactiveEmployees: number;
  productionsByEmployee: Array<{
    id: string;
    name: string;
    role: string;
    totalProductions: number;
    completedProductions: number;
    activeProductions: number;
    totalQuantity: number;
  }>;
  topProducers: Array<{
    id: string;
    name: string;
    role: string;
    totalProductions: number;
    completedProductions: number;
    activeProductions: number;
    totalQuantity: number;
  }>;
}

import { Grid as CustomGrid } from '../../components/CustomGrid';

export function EmployeeTab({ 
  employees, 
  productionRecords
}: EmployeeTabProps) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Funcionários filtrados
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Estatísticas de funcionários
  const employeeStats: EmployeeStats = useMemo(() => {
    const activeEmployees = employees.filter(e => e.active).length;
    
    // Produções por funcionário
    const productionsByEmployee = employees.map(employee => {
      const employeeProductions = productionRecords.filter(
        record => record.employee_id === employee.id
      );
      
      const completedProductions = employeeProductions.filter(
        record => record.status === 'finalizado'
      ).length;
      
      const activeProductions = employeeProductions.filter(
        record => record.status === 'produzindo' || record.status === 'sendo separado'
      ).length;
      
      const totalQuantity = employeeProductions.reduce(
        (sum, record) => sum + record.quantity, 0
      );
      
      return {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        totalProductions: employeeProductions.length,
        completedProductions,
        activeProductions,
        totalQuantity
      };
    });
    
    // Ordenar por total de produções
    const topProducers = [...productionsByEmployee]
      .sort((a, b) => b.totalProductions - a.totalProductions)
      .slice(0, 5);
    
    return {
      activeEmployees,
      inactiveEmployees: employees.length - activeEmployees,
      productionsByEmployee,
      topProducers
    };
  }, [employees, productionRecords]);

  // Dados para o gráfico de produções por função
  const productionsByRoleData = useMemo(() => {
    const roleGroups = employeeStats.productionsByEmployee.reduce((groups: Record<string, { totalProductions: number, totalQuantity: number }>, employee) => {
      if (!groups[employee.role]) {
        groups[employee.role] = {
          totalProductions: 0,
          totalQuantity: 0
        };
      }
      groups[employee.role].totalProductions += employee.totalProductions;
      groups[employee.role].totalQuantity += employee.totalQuantity;
      return groups;
    }, {} as Record<string, { totalProductions: number, totalQuantity: number }>);
    
    return Object.entries(roleGroups).map(([name, data]) => ({
      name,
      produções: data.totalProductions,
      quantidade: data.totalQuantity
    }));
  }, [employeeStats.productionsByEmployee]);

  // Dados para o gráfico de status de funcionários
  const employeeStatusData = useMemo(() => {
    return [
      { name: 'Ativos', value: employeeStats.activeEmployees },
      { name: 'Inativos', value: employeeStats.inactiveEmployees }
    ];
  }, [employeeStats.activeEmployees, employeeStats.inactiveEmployees]);

  // Manipuladores de paginação
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manipulador de busca
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Função para gerar uma cor baseada no nome
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
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
      {/* Barra de busca */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <TextField
          label="Buscar funcionários"
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
        />
      </Paper>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              sx={{ borderRadius: '16px' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Funcionários
                </Typography>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {employees.length}
                </Typography>
                <Chip 
                  icon={<PeopleIcon />} 
                  label="Total" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              sx={{ borderRadius: '16px' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Funcionários Ativos
                </Typography>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {employeeStats.activeEmployees}
                </Typography>
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Ativos" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              sx={{ borderRadius: '16px' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Produções Totais
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {productionRecords.length}
                </Typography>
                <Chip 
                  icon={<FactoryIcon />} 
                  label="Registros" 
                  color="info" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              sx={{ borderRadius: '16px' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Produções por Funcionário
                </Typography>
                <Typography variant="h3" color="secondary.main" fontWeight="bold">
                  {(productionRecords.length / (employeeStats.activeEmployees || 1)).toFixed(1)}
                </Typography>
                <Chip 
                  icon={<WorkIcon />} 
                  label="Média" 
                  color="secondary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Produções por Função */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0}>
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              sx={{ borderRadius: '16px', height: '100%' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Produções por Função
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productionsByRoleData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="produções" name="Número de Produções" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="quantidade" name="Quantidade Total" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>

        {/* Gráfico de Status de Funcionários */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0}>
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={5}
              sx={{ borderRadius: '16px', height: '100%' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status de Funcionários
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={employeeStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {employeeStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: any) => [`${value} funcionários`, 'Quantidade']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </MotionCard>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Produtores */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={6}
        sx={{ borderRadius: '16px', mb: 4 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Produtores
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {employeeStats.topProducers.map((employee, index) => (
              <ListItem key={employee.id} divider={index < employeeStats.topProducers.length - 1}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: stringToColor(employee.name),
                      color: 'white'
                    }}
                  >
                    {employee.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={employee.name}
                  secondary={`${employee.role} • ${employee.totalProductions} produções • ${employee.totalQuantity} unidades`}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={`#${index + 1}`} 
                    color={index === 0 ? 'primary' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip title="Ver detalhes">
                    <IconButton edge="end" size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {employeeStats.topProducers.length === 0 && (
              <ListItem>
                <ListItemText 
                  primary="Nenhum dado de produção disponível"
                  secondary="Não há registros de produção para análise"
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </MotionCard>

      {/* Tabela de Funcionários */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={7}
        sx={{ borderRadius: '16px' }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionários
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de funcionários">
              <TableHead>
                <TableRow>
                  <TableCell>Funcionário</TableCell>
                  <TableCell>Função</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Produções</TableCell>
                  <TableCell>Produções Ativas</TableCell>
                  <TableCell>Produções Concluídas</TableCell>
                  <TableCell>Quantidade Total</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => {
                    const empStats = employeeStats.productionsByEmployee.find(
                      (e: any) => e.id === employee.id
                    ) || {
                      totalProductions: 0,
                      activeProductions: 0,
                      completedProductions: 0,
                      totalQuantity: 0
                    };
                    
                    return (
                      <TableRow
                        key={employee.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: stringToColor(employee.name),
                                color: 'white',
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem'
                              }}
                            >
                              {employee.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {employee.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          <Chip 
                            label={employee.active ? 'Ativo' : 'Inativo'} 
                            color={employee.active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{empStats.totalProductions}</TableCell>
                        <TableCell>{empStats.activeProductions}</TableCell>
                        <TableCell>{empStats.completedProductions}</TableCell>
                        <TableCell>{empStats.totalQuantity}</TableCell>
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
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nenhum funcionário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
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
