import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { ProductionRecord } from '../../types/ProductionRecord';
import { Employee } from '../../types/Employee';
import { Product } from '../../types/Product';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SxProps, Theme } from '@mui/material/styles';

// Componente de linha de tabela com animação
const AnimatedTableRow = motion(TableRow);

// Dados de exemplo para os produtos
const sampleProducts: { [key: string]: Product } = {
  '1': { 
    id: '1', 
    name: 'Gel Construtor Ultra', 
    code: 'GC001', 
    active: true,
    category: 'Gel',
    stock: 100,
    price: 50.0,
    type: 'Gel Construtor',
    batch_number: 'LOTE-GC-2025-001',
    manufacturing_date: '2025-03-15',
    order_number: 'OP-2025-001'
  },
  '2': { 
    id: '2', 
    name: 'Capa Base Flex Premium', 
    code: 'CBF002', 
    active: true,
    category: 'Base',
    stock: 75,
    price: 65.0,
    type: 'Capa Base Flex',
    batch_number: 'LOTE-CBF-2025-002',
    manufacturing_date: '2025-03-20',
    order_number: 'OP-2025-002'
  },
  '3': { 
    id: '3', 
    name: 'TopCoat Shine Diamante', 
    code: 'TCS003', 
    active: true,
    category: 'Finalização',
    stock: 120,
    price: 45.0,
    type: 'TopCoat Shine',
    batch_number: 'LOTE-TCS-2025-003',
    manufacturing_date: '2025-03-25',
    order_number: 'OP-2025-003'
  },
  '4': { 
    id: '4', 
    name: 'Gel Gummy Flexível', 
    code: 'GG004', 
    active: true,
    category: 'Gel',
    stock: 90,
    price: 55.0,
    type: 'Gel Gummy',
    batch_number: 'LOTE-GG-2025-004',
    manufacturing_date: '2025-03-30',
    order_number: 'OP-2025-004'
  },
  '5': { 
    id: '5', 
    name: 'Banho de Fibra Resistente', 
    code: 'BF005', 
    active: true,
    category: 'Fibra',
    stock: 60,
    price: 70.0,
    type: 'Banho de Fibra',
    batch_number: 'LOTE-BF-2025-005',
    manufacturing_date: '2025-04-01',
    order_number: 'OP-2025-005'
  },
};

// Dados de exemplo para os funcionários
const sampleEmployees: { [key: string]: Employee } = {
  '1': { id: '1', name: 'João Silva', role: 'Operador', active: true },
  '2': { id: '2', name: 'Maria Oliveira', role: 'Técnico', active: true },
  '3': { id: '3', name: 'Pedro Santos', role: 'Supervisor', active: true },
};

// Dados de exemplo para os registros de produção
const initialRecords: ProductionRecord[] = [
  {
    id: '1',
    employee_id: '1',
    product_id: '1',
    order_number: 'OP-2025-001',
    batch_number: 'LOTE-GC-2025-001',
    status: 'produzindo',
    start_time: '2025-04-07T08:00:00',
    quantity: 150,
    observations: 'Produção de Gel Construtor iniciada conforme planejado'
  },
  {
    id: '2',
    employee_id: '2',
    product_id: '2',
    order_number: 'OP-2025-002',
    batch_number: 'LOTE-CBF-2025-002',
    status: 'finalizado',
    start_time: '2025-04-06T14:30:00',
    end_time: '2025-04-07T10:15:00',
    quantity: 200,
    observations: 'Produção de Capa Base Flex finalizada com sucesso'
  },
  {
    id: '3',
    employee_id: '3',
    product_id: '3',
    order_number: 'OP-2025-003',
    batch_number: 'LOTE-TCS-2025-003',
    status: 'parado',
    start_time: '2025-04-07T09:45:00',
    quantity: 75,
    observations: 'Produção de TopCoat Shine interrompida para ajuste de viscosidade'
  },
  {
    id: '4',
    employee_id: '1',
    product_id: '4',
    order_number: 'OP-2025-004',
    batch_number: 'LOTE-GG-2025-004',
    status: 'sendo separado',
    start_time: '2025-04-07T11:30:00',
    quantity: 120,
    observations: 'Gel Gummy sendo preparado para embalagem'
  },
  {
    id: '5',
    employee_id: '2',
    product_id: '5',
    order_number: 'OP-2025-005',
    batch_number: 'LOTE-BF-2025-005',
    status: 'produzindo',
    start_time: '2025-04-07T13:15:00',
    quantity: 90,
    observations: 'Produção de Banho de Fibra iniciada, verificar consistência após 2 horas'
  }
];

// Interface para as props do componente
interface ProductionRecordTableProps {
  records?: ProductionRecord[];
  productionId?: string;
  products?: { [key: string]: Product };
  employees?: { [key: string]: Employee };
  onAddRecord?: (record: ProductionRecord) => void;
  onUpdateRecord?: (record: ProductionRecord) => void;
  onDeleteRecord?: (id: string) => void;
  sx?: SxProps<Theme>;
}

// Componente principal da tabela de registros
export const ProductionRecordTable: React.FC<ProductionRecordTableProps> = ({
  records = initialRecords,
  productionId,
  products = sampleProducts,
  employees = sampleEmployees,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  sx = {}
}) => {
  const [tableRecords, setTableRecords] = useState<ProductionRecord[]>(records);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<ProductionRecord>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [openObservationsDialog, setOpenObservationsDialog] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState('');

  // Função para formatar data e hora
  const formatDateTime = (dateTimeStr?: string) => {
    if (!dateTimeStr) return '—';
    try {
      const date = new Date(dateTimeStr);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dateTimeStr || '—';
    }
  };

  // Função para obter a cor do status
  const getStatusColor = (status: ProductionRecord['status']) => {
    switch (status) {
      case 'produzindo':
        return 'primary';
      case 'sendo separado':
        return 'warning';
      case 'parado':
        return 'error';
      case 'finalizado':
        return 'success';
      default:
        return 'default';
    }
  };

  // Abrir diálogo para adicionar/editar registro
  const handleOpenDialog = (record?: ProductionRecord) => {
    if (record) {
      setCurrentRecord({ ...record });
      setIsEditing(true);
    } else {
      // Criar um novo registro com a data/hora atual
      const now = new Date();
      setCurrentRecord({
        start_time: now.toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:MM
        status: 'produzindo',
        quantity: 0
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRecord({});
  };

  // Lidar com mudanças nos campos de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRecord({
      ...currentRecord,
      [name]: name === 'quantity' ? Number(value) : value
    });
  };

  // Lidar com mudanças nos campos de seleção
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentRecord({
      ...currentRecord,
      [name]: value
    });
  };

  // Salvar registro
  const handleSave = () => {
    if (isEditing) {
      // Atualizar registro existente
      const updatedRecord = { ...currentRecord } as ProductionRecord;
      setTableRecords(tableRecords.map(rec => 
        rec.id === updatedRecord.id ? updatedRecord : rec
      ));
      if (onUpdateRecord) onUpdateRecord(updatedRecord);
    } else {
      // Adicionar novo registro
      const newRecord: ProductionRecord = {
        id: String(Date.now()),
        employee_id: currentRecord.employee_id || '',
        product_id: currentRecord.product_id || '',
        order_number: currentRecord.order_number || '',
        batch_number: currentRecord.batch_number || '',
        status: currentRecord.status || 'produzindo',
        start_time: currentRecord.start_time || new Date().toISOString(),
        end_time: currentRecord.end_time,
        quantity: currentRecord.quantity || 0,
        observations: currentRecord.observations
      };
      setTableRecords([...tableRecords, newRecord]);
      if (onAddRecord) onAddRecord(newRecord);
    }
    handleCloseDialog();
  };

  // Excluir registro
  const handleDelete = (id: string) => {
    setTableRecords(tableRecords.filter(rec => rec.id !== id));
    if (onDeleteRecord) onDeleteRecord(id);
  };

  // Abrir diálogo de observações
  const handleOpenObservationsDialog = (observation: string) => {
    setSelectedObservation(observation);
    setOpenObservationsDialog(true);
  };

  return (
    <Box sx={{ ...sx }} className="animate-fade-in">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 2 
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          <EventNoteIcon color="primary" />
          Registros Hora a Hora
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            borderRadius: '8px',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            py: { xs: 0.5, sm: 1 }
          }}
        >
          Novo Registro
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
          borderRadius: { xs: '8px', sm: '12px' }, 
          overflow: 'hidden',
          '& .MuiTable-root': {
            tableLayout: 'fixed'
          },
          '& .MuiTableCell-root': {
            padding: { xs: '8px 4px', sm: '16px 8px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            whiteSpace: { xs: 'nowrap', md: 'normal' },
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)'
            }}>
              <TableCell>Início</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell>OP</TableCell>
              <TableCell>Qtd (Kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Finalização</TableCell>
              <TableCell>Funcionário</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRecords.length > 0 ? (
              tableRecords.map((record, index) => (
                <AnimatedTableRow
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card-hover"
                  sx={{
                    '&:nth-of-type(odd)': {
                      bgcolor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(0, 0, 0, 0.01)'
                    }
                  }}
                >
                  <TableCell>{formatDateTime(record.start_time)}</TableCell>
                  <TableCell>
                    {products[record.product_id]?.name || record.product_id}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={products[record.product_id]?.type || '-'}
                      color="info"
                      size="small"
                      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{products[record.product_id]?.batch_number || record.batch_number}</TableCell>
                  <TableCell>{products[record.product_id]?.order_number || record.order_number}</TableCell>
                  <TableCell>{record.quantity.toLocaleString('pt-BR')} kg</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                      className={record.status === 'produzindo' ? 'status-chip-produzindo' : ''}
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {record.end_time ? formatDateTime(record.end_time) : '—'}
                  </TableCell>
                  <TableCell>
                    {employees[record.employee_id]?.name || record.employee_id}
                  </TableCell>
                  <TableCell>
                    {record.observations ? (
                      <Tooltip title="Ver observações">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenObservationsDialog(record.observations || '')}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(record)}
                        className="button-hover"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(record.id)}
                        className="button-hover"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </AnimatedTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum registro de produção encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para adicionar/editar registro */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Registro de Produção' : 'Adicionar Novo Registro de Produção'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Data e Hora de Início"
                type="datetime-local"
                name="start_time"
                value={currentRecord.start_time ? currentRecord.start_time.slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Data e Hora de Finalização"
                type="datetime-local"
                name="end_time"
                value={currentRecord.end_time ? currentRecord.end_time.slice(0, 16) : ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  name="product_id"
                  value={currentRecord.product_id || ''}
                  onChange={handleSelectChange}
                  label="Produto"
                >
                  {Object.values(products).map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} ({product.type || 'Sem tipo'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Funcionário</InputLabel>
                <Select
                  name="employee_id"
                  value={currentRecord.employee_id || ''}
                  onChange={handleSelectChange}
                  label="Funcionário"
                >
                  {Object.values(employees).map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Ordem de Produção (OP)"
                name="order_number"
                value={currentRecord.order_number || (currentRecord.product_id ? products[currentRecord.product_id]?.order_number || '' : '')}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Número do Lote"
                name="batch_number"
                value={currentRecord.batch_number || (currentRecord.product_id ? products[currentRecord.product_id]?.batch_number || '' : '')}
                onChange={handleInputChange}
                fullWidth
              />
            </Stack>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Quantidade (Kg)"
                name="quantity"
                type="number"
                value={currentRecord.quantity || ''}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentRecord.status || ''}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="produzindo">Produzindo</MenuItem>
                  <MenuItem value="sendo separado">Sendo Separado</MenuItem>
                  <MenuItem value="parado">Parado</MenuItem>
                  <MenuItem value="finalizado">Finalizado</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            
            <TextField
              label="Observações"
              name="observations"
              value={currentRecord.observations || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para exibir observações */}
      <Dialog
        open={openObservationsDialog}
        onClose={() => setOpenObservationsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Observações</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedObservation}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenObservationsDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
