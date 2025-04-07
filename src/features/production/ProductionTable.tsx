import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Box, 
  Typography 
} from '@mui/material'
import { ProductionRecord } from '../../types/ProductionRecord'

interface ProductionTableProps {
  records: ProductionRecord[]
}

const getStatusColor = (status: ProductionRecord['status']) => {
  switch (status) {
    case 'produzindo':
      return 'primary'
    case 'sendo separado':
      return 'warning'
    case 'parado':
      return 'error'
    case 'finalizado':
      return 'success'
    default:
      return 'default'
  }
}

export function ProductionTable({ records }: ProductionTableProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Registros de Produção</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ordem</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell>Funcionário</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Quantidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.order_number}</TableCell>
                <TableCell>{record.batch_number}</TableCell>
                <TableCell>{record.employee_id}</TableCell>
                <TableCell>{record.product_id}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                  />
                </TableCell>
                <TableCell>{record.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
