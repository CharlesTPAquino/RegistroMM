import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Fab,
  useMediaQuery,
  useTheme,
  Zoom
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  sx?: any;
}

export const HourlyRecordTable: React.FC<HourlyRecordTableProps> = ({
  productionId,
  sx = {}
}) => {
  const [records, setRecords] = useState<HourlyRecord[]>(initialRecords);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<HourlyRecord>>({});
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (productionId) {
      const filteredRecords = initialRecords.filter(record => 
        record.production_id === productionId
      );
      setRecords(filteredRecords);
    } else {
      setRecords(initialRecords);
    }
  }, [productionId]);

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

  const handleSelectChange = (e: any) => {
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

  // Função para gerar o relatório PDF
  const generatePdfReport = () => {
    // Criar uma nova instância do jsPDF
    const doc = new jsPDF();
    const tableColumn = ["Horário", "Status", "Operador", "Temperatura", "Pressão", "Qtd. Produzida", "Observações"];
    
    // Mapear os dados da tabela para o formato esperado pelo jsPDF-AutoTable
    const tableRows = records.map(record => {
      const operatorName = operators.find(op => op.id === record.operator_id)?.name || 'N/A';
      const statusMap: Record<string, string> = {
        'produzindo': 'Em Operação',
        'sendo separado': 'Preparação',
        'parado': 'Parado',
        'finalizado': 'Finalizado'
      };
      
      return [
        formatDateTime(record.timestamp),
        statusMap[record.status] || record.status,
        operatorName,
        record.temperature ? `${record.temperature} °C` : 'N/A',
        record.pressure ? `${record.pressure} bar` : 'N/A',
        record.quantity_produced.toString(),
        record.notes || 'N/A'
      ];
    });
    
    // Adicionar título ao PDF
    doc.setFontSize(20);
    doc.text("Relatório de Produção - Registros Hora a Hora", 14, 15);
    
    // Adicionar informações da data do relatório
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);
    doc.text(`ID da Produção: ${productionId}`, 14, 27);
    
    // Adicionar a tabela ao PDF usando AutoTable
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 66, 66] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 35 }
    });
    
    // Salvar o PDF
    doc.save(`relatorio-producao-${productionId}-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <Box sx={{ ...sx, position: 'relative' }} className="animate-fade-in">
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={generatePdfReport}
            disabled={records.length === 0}
            sx={{ 
              borderRadius: '8px',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 }
            }}
          >
            Relatório PDF
          </Button>
          {!isMobile && (
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
          )}
        </Box>
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
            <TableRow>
              <TableCell sx={{ width: { xs: '70px', sm: 'auto' } }}>Horário</TableCell>
              <TableCell sx={{ width: { xs: '70px', sm: 'auto' } }}>Status</TableCell>
              <TableCell sx={{ width: { xs: '80px', sm: 'auto' } }}>Operador</TableCell>
              <TableCell sx={{ width: { xs: '70px', sm: 'auto' } }}>Qtd. Produzida</TableCell>
              <TableCell sx={{ width: { xs: '80px', sm: 'auto' } }}>Temperatura (°C)</TableCell>
              <TableCell sx={{ width: { xs: '70px', sm: 'auto' } }}>Pressão (bar)</TableCell>
              <TableCell sx={{ width: { xs: '80px', sm: 'auto' } }}>Observações</TableCell>
              <TableCell align="center" sx={{ width: { xs: '100px', sm: 'auto' } }}>Ações</TableCell>
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
                    <Box sx={{ 
                      display: 'flex', 
                      gap: '1px', 
                      justifyContent: 'center',
                      flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(record)}
                        sx={{ 
                          minWidth: { xs: '28px', sm: '32px' }, 
                          padding: { xs: '3px 6px', sm: '4px 8px' },
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          m: '1px'
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(record.id)}
                        sx={{ 
                          minWidth: { xs: '28px', sm: '32px' }, 
                          padding: { xs: '3px 6px', sm: '4px 8px' },
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          m: '1px'
                        }}
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

      {/* Botão de ação flutuante (FAB) para dispositivos móveis */}
      {isMobile && (
        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
          <Fab
            color="primary"
            aria-label="adicionar registro"
            onClick={() => handleOpenDialog()}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              '&:active': {
                transform: 'scale(0.95)',
                transition: 'transform 0.1s'
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}

      {/* Diálogo para adicionar/editar registros */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: '12px', sm: '16px' },
            padding: { xs: 1, sm: 2 },
            width: { xs: '95%', sm: '100%' }
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', pb: 2 }}>
          {isEditing ? 'Editar Registro Hora a Hora' : 'Adicionar Novo Registro Hora a Hora'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2 
            }}>
              <TextField
                label="Horário"
                type="time"
                value={currentRecord.timestamp || ''}
                onChange={(e) => setCurrentRecord({ ...currentRecord, timestamp: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    padding: { xs: '10px 12px', sm: '12px 14px' }
                  }
                }}
              />
              <FormControl fullWidth required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={currentRecord.status || ''}
                  name="status"
                  label="Status"
                  onChange={handleSelectChange}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      padding: { xs: '10px 12px', sm: '12px 14px' }
                    }
                  }}
                >
                  <MenuItem value="running">Em Operação</MenuItem>
                  <MenuItem value="stopped">Parado</MenuItem>
                  <MenuItem value="maintenance">Em Manutenção</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2 
            }}>
              <TextField
                label="Temperatura (°C)"
                type="number"
                value={currentRecord.temperature || ''}
                onChange={(e) => setCurrentRecord({ ...currentRecord, temperature: Number(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <ThermostatIcon color="primary" sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                  ),
                }}
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    padding: { xs: '10px 12px', sm: '12px 14px' }
                  }
                }}
              />
              <TextField
                label="Pressão (bar)"
                type="number"
                value={currentRecord.pressure || ''}
                onChange={(e) => setCurrentRecord({ ...currentRecord, pressure: Number(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <SpeedIcon color="primary" sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                  ),
                }}
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    padding: { xs: '10px 12px', sm: '12px 14px' }
                  }
                }}
                inputProps={{ step: 0.1 }}
              />
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2 
            }}>
              <FormControl fullWidth required>
                <InputLabel id="operator-label">Operador</InputLabel>
                <Select
                  labelId="operator-label"
                  value={currentRecord.operator_id || ''}
                  name="operator_id"
                  label="Operador"
                  onChange={handleSelectChange}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      padding: { xs: '10px 12px', sm: '12px 14px' }
                    }
                  }}
                >
                  {operators.map((operator) => (
                    <MenuItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantidade Produzida"
                type="number"
                value={currentRecord.quantity_produced || ''}
                onChange={(e) => setCurrentRecord({ ...currentRecord, quantity_produced: Number(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <InventoryIcon color="primary" sx={{ mr: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                  ),
                }}
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    padding: { xs: '10px 12px', sm: '12px 14px' }
                  }
                }}
              />
            </Box>

            <TextField
              label="Observações"
              multiline
              rows={3}
              value={currentRecord.notes || ''}
              onChange={(e) => setCurrentRecord({ ...currentRecord, notes: e.target.value })}
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '10px 12px', sm: '12px 14px' }
                }
              }}
            />
          </Stack>
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
