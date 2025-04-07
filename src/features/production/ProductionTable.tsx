import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ProductionRecord } from '../../types/ProductionRecord';

interface ProductionTableProps {
  records: ProductionRecord[];
  onEdit: (record: ProductionRecord) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: ProductionRecord['status']) => {
  const colors = {
    'produzindo': 'primary',
    'sendo separado': 'warning',
    'parado': 'error',
    'finalizado': 'success'
  };
  return colors[status] || 'default';
};

export const ProductionTable: React.FC<ProductionTableProps> = ({
  records,
  onEdit,
  onDelete
}) => {
  return (
    <TableContainer component={Paper}>
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
                  color={getStatusColor(record.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(record)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(record.id)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
