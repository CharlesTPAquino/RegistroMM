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
  Chip
} from '@mui/material';
import { HourlyRecord } from '../../types/HourlyRecord';
import { Employee } from '../../types/Employee';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';

// Dados de exemplo para os operadores
const operators: Employee[] = [
  { id: '1', name: 'João Silva', role: 'Farmacêutico', active: true },
  { id: '2', name: 'Maria Oliveira', role: 'Técnico', active: true },
  { id: '3', name: 'Pedro Santos', role: 'Auxiliar', active: true },
];

// Dados de exemplo para os registros hora a hora
const initialRecords: HourlyRecord[] = [
  {
    id: '1',
    production_id: '101',
    timestamp: '2025-04-07T08:00:00',
    status: 'produzindo',
    notes: 'Início da produção',
    quantity_produced: 0,
    temperature: 25.5,
    pressure: 1.0,
    operator_id: '1'
  },
  {
    id: '2',
    production_id: '101',
    timestamp: '2025-04-07T09:00:00',
    status: 'produzindo',
    notes: 'Produção em andamento',
    quantity_produced: 25,
    temperature: 26.0,
    pressure: 1.1,
    operator_id: '1'
  },
  {
    id: '3',
    production_id: '101',
    timestamp: '2025-04-07T10:00:00',
    status: 'parado',
    notes: 'Pausa para manutenção',
    quantity_produced: 25,
    temperature: 25.8,
    pressure: 1.0,
    operator_id: '2'
  },
  {
    id: '4',
    production_id: '101',
    timestamp: '2025-04-07T11:00:00',
    status: 'produzindo',
    notes: 'Retomada da produção',
    quantity_produced: 40,
    temperature: 25.7,
    pressure: 1.0,
    operator_id: '2'
  },
  {
    id: '5',
    production_id: '101',
    timestamp: '2025-04-07T12:00:00',
    status: 'sendo separado',
    notes: 'Início da separação',
    quantity_produced: 75,
    temperature: 25.5,
    pressure: 1.0,
    operator_id: '3'
  }
];

interface HourlyRecordTableProps {
  productionId: string;
}

export function HourlyRecordTable({ productionId }: HourlyRecordTableProps) {
  const [records, setRecords] = useState<HourlyRecord[]>(initialRecords);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<HourlyRecord>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (record?: HourlyRecord) => {
    if (record) {
      setCurrentRecord({ ...record });
      setIsEditing(true);
    } else {
      // Criar um novo registro com a data/hora atual
      const now = new Date();
      setCurrentRecord({
        production_id: productionId,
        timestamp: now.toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:MM
        status: 'produzindo',
        quantity_produced: records.length > 0 ? records[records.length - 1].quantity_produced : 0,
        operator_id: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRecord({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRecord({
      ...currentRecord,
      [name]: name === 'quantity_produced' || name === 'temperature' || name === 'pressure' 
        ? Number(value) 
        : value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setCurrentRecord({
      ...currentRecord,
      [name]: value
    });
  };

  const handleSave = () => {
    if (isEditing) {
      // Atualizar registro existente
      setRecords(records.map(rec => 
        rec.id === currentRecord.id ? { ...rec, ...currentRecord } as HourlyRecord : rec
      ));
    } else {
      // Adicionar novo registro
      const newRecord: HourlyRecord = {
        id: String(Date.now()),
        production_id: currentRecord.production_id || productionId,
        timestamp: currentRecord.timestamp || new Date().toISOString(),
        status: currentRecord.status || 'produzindo',
        notes: currentRecord.notes || '',
        quantity_produced: currentRecord.quantity_produced || 0,
        temperature: currentRecord.temperature,
        pressure: currentRecord.pressure,
        operator_id: currentRecord.operator_id || ''
      };
      setRecords([...records, newRecord]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(rec => rec.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'produzindo':
        return 'success';
      case 'sendo separado':
        return 'info';
      case 'parado':
        return 'error';
      case 'finalizado':
        return 'default';
      default:
        return 'default';
    }
  };

  const getOperatorName = (operatorId: string) => {
    const operator = operators.find(op => op.id === operatorId);
    return operator ? operator.name : 'Desconhecido';
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon color="primary" />
          Registro Hora a Hora
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        >
          Adicionar Registro
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Horário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Operador</TableCell>
              <TableCell>Qtd. Produzida</TableCell>
              <TableCell>Temperatura (°C)</TableCell>
              <TableCell>Pressão (bar)</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{formatDateTime(record.timestamp)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                      color={getStatusColor(record.status) as any}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    {getOperatorName(record.operator_id) || '-'}
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon fontSize="small" color="action" />
                    {record.quantity_produced}
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThermostatIcon fontSize="small" color="error" />
                    {record.temperature ? `${record.temperature.toFixed(1)} °C` : '-'}
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpeedIcon fontSize="small" color="info" />
                    {record.pressure ? `${record.pressure.toFixed(1)} bar` : '-'}
                  </TableCell>
                  <TableCell>{record.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(record)}
                        sx={{ minWidth: '32px', padding: '4px 8px' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(record.id)}
                        sx={{ minWidth: '32px', padding: '4px 8px' }}
                      >
                        Excluir
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum registro encontrado para esta produção.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ mt: 2 }}
                  >
                    Adicionar Primeiro Registro
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', pb: 2 }}>
          {isEditing ? 'Editar Registro Hora a Hora' : 'Adicionar Novo Registro Hora a Hora'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Data e Hora"
              type="datetime-local"
              name="timestamp"
              value={currentRecord.timestamp ? currentRecord.timestamp.slice(0, 16) : ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={currentRecord.status || ''}
                onChange={handleSelectChange}
                label="Status"
              >
                <MenuItem value="sendo separado">Sendo Separado</MenuItem>
                <MenuItem value="produzindo">Produzindo</MenuItem>
                <MenuItem value="parado">Parado</MenuItem>
                <MenuItem value="finalizado">Finalizado</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Operador</InputLabel>
              <Select
                name="operator_id"
                value={currentRecord.operator_id || ''}
                onChange={handleSelectChange}
                label="Operador"
              >
                {operators.map(operator => (
                  <MenuItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Quantidade Produzida"
              name="quantity_produced"
              type="number"
              value={currentRecord.quantity_produced || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            
            <TextField
              label="Temperatura (°C)"
              name="temperature"
              type="number"
              value={currentRecord.temperature || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <ThermostatIcon color="error" sx={{ mr: 1 }} />,
              }}
            />
            
            <TextField
              label="Pressão (bar)"
              name="pressure"
              type="number"
              value={currentRecord.pressure || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <SpeedIcon color="info" sx={{ mr: 1 }} />,
              }}
              inputProps={{ step: 0.1 }}
            />
            
            <TextField
              label="Observações"
              name="notes"
              value={currentRecord.notes || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              sx={{ gridColumn: { md: '1 / span 2' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #f0f0f0', p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
