import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './styles/global.css';
import './styles/TabsStyles.css';
import './styles/MaterialStyles.css';
import './styles/fonts.css';
import { 
  Button, Typography, Box, Container, Paper, TextField, Select, MenuItem, 
  SelectChangeEvent, FormControl, InputLabel, Tab, Tabs, Alert, 
  CircularProgress, FormHelperText, Chip, IconButton, CssBaseline, ThemeProvider, Stack,
  createTheme
} from '@mui/material';

// Importando ícones
import { 
  Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

// Importando jsPDF e autotable
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importando os estilos externos
import { 
  containerStyles, 
  tabsContainerStyles, 
  tabsStyles, 
  alertStyles,
  titleStyles
} from './styles/AppStyles';

// Criando o tema personalizado
const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand, sans-serif',
    h4: {
      fontFamily: 'Bungee Tint, cursive',
      fontWeight: 400
    }
  }
});

// Importando componentes de tabela
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// Definição de tipos
interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductionRecord {
  id: string;
  employee_id: string;
  product_id: string;
  order_number: string;
  batch_number: string;
  status: 'produzindo' | 'sendo separado' | 'parado' | 'finalizado';
  created_at?: string;
  employees?: { name: string };
  products?: { name: string };
  employee_name?: string;
  product_name?: string;
}

// Interface para o MelhoradoSelect
interface MelhoradoSelectOption {
  value: string | number;
  label: string;
}

interface MelhoradoSelectProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  options: MelhoradoSelectOption[];
  helperText?: string;
  id?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
}

// Componente customizado para Select padronizado
const MelhoradoSelect: React.FC<MelhoradoSelectProps> = ({
  label,
  value,
  onChange,
  options,
  helperText,
  id,
  required = false,
  error = false,
  disabled = false
}) => {
  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel id={`${id}-label`} required={required}>
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

// Componente de botão de salvar personalizado
interface SaveButtonProps {
  loading: boolean;
  actionText: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
}

const SaveButton: React.FC<SaveButtonProps> = ({ loading, actionText, startIcon, ...props }) => (
  <Button
    {...props}
    variant="contained"
    size="large"
    className="save-button"
    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon || <SaveIcon />}
    disabled={loading}
  >
    {actionText}
  </Button>
);

function App() {
  // Estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Partial<ProductionRecord>>({});
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [currentTab, setCurrentTab] = useState(0);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    const rect = element.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    
    const existingRipple = element.getElementsByClassName('ripple')[0];
    if (existingRipple) {
      existingRipple.remove();
    }
    
    element.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, employeesData, productsData] = await Promise.all([
        supabase.from('production_records').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('products').select('*')
      ]);

      if (recordsData.error) throw recordsData.error;
      if (employeesData.error) throw employeesData.error;
      if (productsData.error) throw productsData.error;

      setRecords(recordsData.data || []);
      setEmployees(employeesData.data || []);
      setProducts(productsData.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<ProductionRecord>) => {
    setLoading(true);
    try {
      if (data.id) {
        const { error } = await supabase
          .from('production_records')
          .update(data)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('production_records')
          .insert([data]);
        if (error) throw error;
      }
      
      await loadData();
      setCurrentRecord({});
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('production_records')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: ProductionRecord) => {
    setCurrentRecord(record);
  };

  const handleChange = (field: keyof ProductionRecord, value: any) => {
    setCurrentRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .insert([currentEmployee]);
      if (error) throw error;
      await loadData();
      setCurrentEmployee({});
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([currentProduct]);
      if (error) throw error;
      await loadData();
      setCurrentProduct({});
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Adiciona o título
    doc.setFontSize(20);
    doc.text('Relatório de Produção', 14, 22);
    doc.setFontSize(12);
    
    // Prepara os dados para a tabela
    const tableData = records.map(record => [
      record.order_number,
      record.batch_number,
      record.employee_name || record.employees?.name || '',
      record.product_name || record.products?.name || '',
      record.status
    ]);
    
    // Configura e gera a tabela
    autoTable(doc, {
      head: [['Ordem', 'Lote', 'Funcionário', 'Produto', 'Status']],
      body: tableData,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Salva o PDF
    doc.save('relatorio-producao.pdf');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Box className="container">
          <header className="app-header">
            <div className="title-container">
              <Typography 
                variant="h4" 
                component="h1"
                className="app-title"
              >
                MISTURA E MANIPULAÇÃO
              </Typography>
            </div>
            <Box className="tabs-container">
              <Tabs 
                value={currentTab} 
                onChange={(_, newValue) => setCurrentTab(newValue)}
                className="tabs-list"
                TabIndicatorProps={{
                  className: "tab-indicator"
                }}
              >
                <Tab 
                  label="Produção" 
                  className="tab-button"
                  onMouseDown={createRipple}
                  component="div"
                />
                <Tab 
                  label="Funcionários" 
                  className="tab-button"
                  onMouseDown={createRipple}
                  component="div"
                />
                <Tab 
                  label="Produtos" 
                  className="tab-button"
                  onMouseDown={createRipple}
                  component="div"
                />
              </Tabs>
            </Box>

            {currentTab === 0 && (
              <Stack direction="row" spacing={2} className="actions-toolbar">
              </Stack>
            )}
          </header>

          <Container maxWidth="lg">
            {error && (
              <Alert severity="error" className="alert" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Aba de Produção */}
            {currentTab === 0 && (
              <>
                <Paper className="paper">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(currentRecord);
                  }}>
                    <Box className="form-grid form-grid-2-cols">
                      <Box>
                        <TextField
                          fullWidth
                          label="Número da Ordem"
                          value={currentRecord.order_number || ''}
                          onChange={(e) => handleChange('order_number', e.target.value)}
                          required
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="Número do Lote"
                          value={currentRecord.batch_number || ''}
                          onChange={(e) => handleChange('batch_number', e.target.value)}
                          required
                        />
                      </Box>
                      <Box>
                        <MelhoradoSelect
                          label="Funcionário"
                          value={currentRecord.employee_id || ''}
                          onChange={(e) => handleChange('employee_id', e.target.value)}
                          options={employees.map(emp => ({
                            value: emp.id,
                            label: emp.name
                          }))}
                          required
                        />
                      </Box>
                      <Box>
                        <MelhoradoSelect
                          label="Produto"
                          value={currentRecord.product_id || ''}
                          onChange={(e) => handleChange('product_id', e.target.value)}
                          options={products.map(prod => ({
                            value: prod.id,
                            label: prod.name
                          }))}
                          required
                        />
                      </Box>
                      <Box>
                        <MelhoradoSelect
                          label="Status"
                          value={currentRecord.status || ''}
                          onChange={(e) => handleChange('status', e.target.value as any)}
                          options={[
                            { value: 'produzindo', label: 'Produzindo' },
                            { value: 'sendo separado', label: 'Sendo Separado' },
                            { value: 'parado', label: 'Parado' },
                            { value: 'finalizado', label: 'Finalizado' }
                          ]}
                          required
                        />
                      </Box>
                      <Box className="form-full-width">
                        <SaveButton
                          loading={loading}
                          actionText={currentRecord.id ? 'Atualizar' : 'Criar'}
                          type="submit"
                          fullWidth
                          className="save-button"
                        />
                      </Box>
                    </Box>
                  </form>
                </Paper>

                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer component={Paper} className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ordem</TableCell>
                          <TableCell>Lote</TableCell>
                          <TableCell>Funcionário</TableCell>
                          <TableCell>Produto</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {records.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.order_number}</TableCell>
                            <TableCell>{record.batch_number}</TableCell>
                            <TableCell>{record.employee_name || record.employees?.name}</TableCell>
                            <TableCell>{record.product_name || record.products?.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={record.status} 
                                className={`chip-status-${record.status === 'produzindo' ? 'producing' :
                                  record.status === 'sendo separado' ? 'separating' :
                                  record.status === 'parado' ? 'stopped' :
                                  record.status === 'finalizado' ? 'finished' : 'default'}`}
                                size="small"
                              />
                            </TableCell>
                            <TableCell className="actions-cell">
                              <IconButton 
                                onClick={() => handleEdit(record)} 
                                size="small"
                                className="action-button edit-button"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDelete(record.id)} 
                                size="small" 
                                color="error"
                                className="action-button delete-button"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Box className="pdf-button-container">
                  <SaveButton
                    loading={false}
                    actionText="Salvar em PDF"
                    type="button"
                    fullWidth
                    className="pdf-button"
                    onClick={handleExportPDF}
                    startIcon={<PdfIcon />}
                  />
                </Box>
              </>
            )}

            {/* Aba de Funcionários */}
            {currentTab === 1 && (
              <Paper className="paper">
                <Typography variant="h6" gutterBottom>
                  Registrar Funcionário
                </Typography>
                <form onSubmit={handleEmployeeSubmit}>
                  <Box className="form-grid form-grid-2-cols">
                    <Box>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={currentEmployee.name || ''}
                        onChange={(e) => setCurrentEmployee(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={currentEmployee.email || ''}
                        onChange={(e) => setCurrentEmployee(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Cargo"
                        value={currentEmployee.role || ''}
                        onChange={(e) => setCurrentEmployee(prev => ({ ...prev, role: e.target.value }))}
                        required
                      />
                    </Box>
                    <Box className="form-full-width">
                      <SaveButton
                        loading={loading}
                        actionText="Registrar"
                        type="submit"
                        fullWidth
                        className="save-button"
                      />
                    </Box>
                  </Box>
                </form>

                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer component={Paper} className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Cargo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.role}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* Aba de Produtos */}
            {currentTab === 2 && (
              <Paper className="paper">
                <Typography variant="h6" gutterBottom>
                  Registrar Produto
                </Typography>
                <form onSubmit={handleProductSubmit}>
                  <Box className="form-grid form-grid-2-cols">
                    <Box>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={currentProduct.name || ''}
                        onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Descrição"
                        value={currentProduct.description || ''}
                        onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </Box>
                    <Box className="form-full-width">
                      <SaveButton
                        loading={loading}
                        actionText="Registrar"
                        type="submit"
                        fullWidth
                        className="save-button"
                      />
                    </Box>
                  </Box>
                </form>

                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableContainer component={Paper} className="table-container">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell>Descrição</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;