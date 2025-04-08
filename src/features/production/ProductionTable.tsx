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
  Typography,
  Tooltip,
  IconButton
} from '@mui/material'
import { ProductionRecord } from '../../types/ProductionRecord'
import InfoIcon from '@mui/icons-material/Info'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface ProductionTableProps {
  records: ProductionRecord[]
  products?: { [key: string]: { name: string } }
  employees?: { [key: string]: { name: string } }
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

// Função para formatar data e hora
const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch (error) {
    return dateTimeStr || '—'
  }
}

// Componente de linha de tabela com animação
const AnimatedTableRow = motion(TableRow)

export function ProductionTable({ 
  records, 
  products = {}, 
  employees = {} 
}: ProductionTableProps) {
  return (
    <Box sx={{ p: 3 }} className="animate-fade-in">
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <span>Registros de Produção</span>
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.4)' 
            : '0 8px 24px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
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
              <TableCell>OP</TableCell>
              <TableCell>Qtd (Kg)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Finalização</TableCell>
              <TableCell>Funcionário</TableCell>
              <TableCell>Observações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
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
                <TableCell>{record.order_number}</TableCell>
                <TableCell>{record.quantity.toLocaleString('pt-BR')} kg</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      animation: record.status === 'produzindo' ? 'pulse 2s infinite' : 'none'
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
                    <Tooltip title={record.observations}>
                      <IconButton size="small" color="info">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : '—'}
                </TableCell>
              </AnimatedTableRow>
            ))}
            
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum registro de produção encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
