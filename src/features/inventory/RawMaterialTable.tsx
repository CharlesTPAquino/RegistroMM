/** @jsxImportSource react */
import { useState } from 'react';
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
  IconButton,
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
  Chip,
  Tooltip,
  SxProps,
  Theme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import { RawMaterial } from '../../types/RawMaterial';

// Componente de linha de tabela animada
const AnimatedTableRow = styled(motion.tr)``;

// Tipos de produtos
const materialTypes = [
  'Princípio Ativo',
  'Excipiente',
  'Embalagem',
  'Rótulo',
  'Outro'
];

// Dados de exemplo para matérias primas
const initialMaterials: RawMaterial[] = [
  {
    id: '1',
    name: 'Paracetamol',
    type: 'Princípio Ativo',
    quantity: 25.5,
    batch_number: 'MP-2025-001',
    expiration_date: '2026-12-31',
    supplier: 'Fornecedor A',
    storage_location: 'Prateleira A1',
    notes: 'Armazenar em local seco e arejado',
    created_at: '2025-01-15T10:00:00',
    updated_at: '2025-01-15T10:00:00'
  },
  {
    id: '2',
    name: 'Lactose',
    type: 'Excipiente',
    quantity: 100,
    batch_number: 'MP-2025-002',
    expiration_date: '2027-06-30',
    supplier: 'Fornecedor B',
    storage_location: 'Prateleira B2',
    notes: '',
    created_at: '2025-01-20T14:30:00',
    updated_at: '2025-01-20T14:30:00'
  },
  {
    id: '3',
    name: 'Frasco de Vidro 100ml',
    type: 'Embalagem',
    quantity: 500,
    batch_number: 'MP-2025-003',
    expiration_date: '2030-01-01',
    supplier: 'Fornecedor C',
    storage_location: 'Estante C3',
    notes: 'Frágil, manusear com cuidado',
    created_at: '2025-02-05T09:15:00',
    updated_at: '2025-02-05T09:15:00'
  },
  {
    id: '4',
    name: 'Estearato de Magnésio',
    type: 'Excipiente',
    quantity: 15.75,
    batch_number: 'MP-2025-004',
    expiration_date: '2026-08-15',
    supplier: 'Fornecedor B',
    storage_location: 'Prateleira B1',
    notes: '',
    created_at: '2025-02-10T11:45:00',
    updated_at: '2025-02-10T11:45:00'
  },
  {
    id: '5',
    name: 'Rótulo Paracetamol 500mg',
    type: 'Rótulo',
    quantity: 1000,
    batch_number: 'MP-2025-005',
    expiration_date: '2028-12-31',
    supplier: 'Fornecedor D',
    storage_location: 'Gaveta D1',
    notes: 'Manter em local seco',
    created_at: '2025-02-15T16:20:00',
    updated_at: '2025-02-15T16:20:00'
  }
];

// Interface para as props do componente
interface RawMaterialTableProps {
  materials?: RawMaterial[];
  onAddMaterial?: (material: RawMaterial) => void;
  onUpdateMaterial?: (material: RawMaterial) => void;
  onDeleteMaterial?: (id: string) => void;
  sx?: SxProps<Theme>;
}

// Função para formatar a data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para verificar se a data de validade está próxima ou expirada
const getExpirationStatus = (expirationDate: string) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'expirado';
  } else if (diffDays <= 30) {
    return 'próximo';
  } else {
    return 'válido';
  }
};

// Função para obter a cor do chip de status de validade
const getExpirationColor = (status: string) => {
  switch (status) {
    case 'expirado':
      return 'error';
    case 'próximo':
      return 'warning';
    case 'válido':
      return 'success';
    default:
      return 'default';
  }
};

// Componente principal da tabela de matérias primas
export function RawMaterialTable({
  materials = initialMaterials,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  sx = {}
}: RawMaterialTableProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [currentNotes, setCurrentNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<RawMaterial>>({
    name: '',
    type: '',
    quantity: 0,
    batch_number: '',
    expiration_date: '',
    supplier: '',
    storage_location: '',
    notes: ''
  });
  
  // Estado para os materiais da tabela
  const [tableMaterials, setTableMaterials] = useState<RawMaterial[]>(materials);
  
  // Função para abrir o diálogo de adição/edição
  const handleOpenDialog = (material?: RawMaterial) => {
    if (material) {
      setCurrentMaterial({...material});
      setIsEditing(true);
    } else {
      setCurrentMaterial({
        name: '',
        type: '',
        quantity: 0,
        batch_number: '',
        expiration_date: '',
        supplier: '',
        storage_location: '',
        notes: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };
  
  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Função para abrir o diálogo de notas
  const handleOpenNotesDialog = (notes: string) => {
    setCurrentNotes(notes);
    setOpenNotesDialog(true);
  };
  
  // Função para fechar o diálogo de notas
  const handleCloseNotesDialog = () => {
    setOpenNotesDialog(false);
  };
  
  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentMaterial({
      ...currentMaterial,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };
  
  // Função para lidar com mudanças nos selects
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentMaterial({
      ...currentMaterial,
      [name]: value
    });
  };
  
  // Função para salvar o material
  const handleSave = () => {
    const now = new Date().toISOString();
    
    if (isEditing && currentMaterial.id) {
      const updatedMaterial = {
        ...currentMaterial,
        updated_at: now
      } as RawMaterial;
      
      if (onUpdateMaterial) {
        onUpdateMaterial(updatedMaterial);
      } else {
        // Atualiza localmente se não houver função de callback
        setTableMaterials(prevMaterials => 
          prevMaterials.map(mat => 
            mat.id === updatedMaterial.id ? updatedMaterial : mat
          )
        );
      }
    } else {
      const newMaterial = {
        ...currentMaterial,
        id: `${Date.now()}`, // Gera um ID único baseado no timestamp
        created_at: now,
        updated_at: now
      } as RawMaterial;
      
      if (onAddMaterial) {
        onAddMaterial(newMaterial);
      } else {
        // Adiciona localmente se não houver função de callback
        setTableMaterials(prevMaterials => [...prevMaterials, newMaterial]);
      }
    }
    
    handleCloseDialog();
  };
  
  // Função para excluir um material
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      if (onDeleteMaterial) {
        onDeleteMaterial(id);
      } else {
        // Remove localmente se não houver função de callback
        setTableMaterials(prevMaterials => 
          prevMaterials.filter(mat => mat.id !== id)
        );
      }
    }
  };
  
  return (
    <Box sx={{ ...sx }} className="animate-fade-in">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          <InventoryIcon color="primary" />
          Matérias Primas
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
          Novo Material
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
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade (Kg)</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell>Validade</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableMaterials.length > 0 ? (
              tableMaterials.map((material, index) => {
                const expirationStatus = getExpirationStatus(material.expiration_date);
                
                return (
                  <AnimatedTableRow
                    key={material.id}
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
                    <TableCell>{material.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={material.type}
                        color="info"
                        size="small"
                        sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{material.quantity.toLocaleString('pt-BR')} kg</TableCell>
                    <TableCell>{material.batch_number}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${formatDate(material.expiration_date)}`}
                        color={getExpirationColor(expirationStatus)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{material.supplier || '—'}</TableCell>
                    <TableCell>{material.storage_location || '—'}</TableCell>
                    <TableCell>
                      {material.notes ? (
                        <Tooltip title="Ver observações">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenNotesDialog(material.notes || '')}
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
                          onClick={() => handleOpenDialog(material)}
                          className="button-hover"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(material.id)}
                          className="button-hover"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </AnimatedTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma matéria prima encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para adicionar/editar material */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Matéria Prima' : 'Adicionar Nova Matéria Prima'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              name="name"
              value={currentMaterial.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="type"
                value={currentMaterial.type || ''}
                onChange={handleSelectChange}
                label="Tipo"
              >
                {materialTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Quantidade (Kg)"
              name="quantity"
              type="number"
              value={currentMaterial.quantity || ''}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ step: 0.01 }}
            />
            
            <TextField
              label="Lote"
              name="batch_number"
              value={currentMaterial.batch_number || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <TextField
              label="Data de Validade"
              name="expiration_date"
              type="date"
              value={currentMaterial.expiration_date ? currentMaterial.expiration_date.slice(0, 10) : ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="Fornecedor"
              name="supplier"
              value={currentMaterial.supplier || ''}
              onChange={handleInputChange}
              fullWidth
            />
            
            <TextField
              label="Localização no Estoque"
              name="storage_location"
              value={currentMaterial.storage_location || ''}
              onChange={handleInputChange}
              fullWidth
            />
            
            <TextField
              label="Observações"
              name="notes"
              value={currentMaterial.notes || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={!currentMaterial.name || !currentMaterial.type || !currentMaterial.batch_number || !currentMaterial.expiration_date}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para exibir observações */}
      <Dialog open={openNotesDialog} onClose={handleCloseNotesDialog}>
        <DialogTitle>Observações</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {currentNotes || 'Nenhuma observação disponível.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotesDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
