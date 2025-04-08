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
  SelectChangeEvent
} from '@mui/material';
import { Employee } from '../../types/Employee';

// Dados de exemplo
const initialEmployees: Employee[] = [
  { id: '1', name: 'João Silva', role: 'Farmacêutico', active: true },
  { id: '2', name: 'Maria Oliveira', role: 'Técnico', active: true },
  { id: '3', name: 'Pedro Santos', role: 'Auxiliar', active: false },
  { id: '4', name: 'Ana Souza', role: 'Farmacêutico', active: true },
  { id: '5', name: 'Carlos Ferreira', role: 'Técnico', active: true }
];

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee({ ...employee });
      setIsEditing(true);
    } else {
      setCurrentEmployee({ name: '', role: 'Auxiliar', active: true });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmployee({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEmployee({
      ...currentEmployee,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setCurrentEmployee({
      ...currentEmployee,
      [name]: value
    });
  };

  const handleSave = () => {
    if (isEditing) {
      // Atualizar funcionário existente
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? { ...emp, ...currentEmployee } as Employee : emp
      ));
    } else {
      // Adicionar novo funcionário
      const newEmployee: Employee = {
        id: String(Date.now()),
        name: currentEmployee.name || '',
        role: currentEmployee.role || 'Auxiliar',
        active: currentEmployee.active !== undefined ? currentEmployee.active : true
      };
      setEmployees([...employees, newEmployee]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Lista de Funcionários</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
        >
          Adicionar Funcionário
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{ 
                      py: 0.5, 
                      px: 1.5, 
                      borderRadius: 1, 
                      backgroundColor: employee.active ? 'success.light' : 'error.light',
                      color: employee.active ? 'success.dark' : 'error.dark',
                      fontWeight: 'medium',
                      fontSize: '0.75rem'
                    }}
                  >
                    {employee.active ? 'Ativo' : 'Inativo'}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenDialog(employee)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color={employee.active ? 'error' : 'success'}
                    onClick={() => handleToggleActive(employee.id)}
                  >
                    {employee.active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar funcionário */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Funcionário' : 'Adicionar Funcionário'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={currentEmployee.name || ''}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Função</InputLabel>
              <Select
                name="role"
                value={currentEmployee.role || ''}
                onChange={handleSelectChange}
                label="Função"
              >
                <MenuItem value="Farmacêutico">Farmacêutico</MenuItem>
                <MenuItem value="Técnico">Técnico</MenuItem>
                <MenuItem value="Auxiliar">Auxiliar</MenuItem>
              </Select>
            </FormControl>
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
