import React, { useState } from 'react';
import { Box, Typography, Divider, Button, Card, CardContent, CardHeader, Chip } from '@mui/material';
import { ProductionForm } from './ProductionForm';
import { ProductionRecordTable } from './ProductionRecordTable';
import { ProductionRecord } from '../../types/ProductionRecord';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FactoryIcon from '@mui/icons-material/Factory';

export function ProductionPage() {
  const [activeProductionId, setActiveProductionId] = useState<string>('101');
  const [productionRecord, setProductionRecord] = useState<Partial<ProductionRecord>>({
    id: '101',
    order_number: 'ORD-2025-001',
    batch_number: 'LOT-2025-001',
    employee_id: '1',
    product_id: '1',
    status: 'produzindo',
    quantity: 100
  });

  const handleFormSubmit = (data: Partial<ProductionRecord>) => {
    console.log('Formulário de produção enviado:', data);
    setProductionRecord({...productionRecord, ...data});
    
    // Se o ID da produção mudar, atualize o ID ativo
    if (data.id && data.id !== activeProductionId) {
      setActiveProductionId(data.id);
    }
  };

  // Função para alternar entre diferentes produções (em uma aplicação real, isso seria uma lista)
  const handleChangeProduction = () => {
    // Simula a troca para outra produção
    const newId = activeProductionId === '101' ? '102' : '101';
    setActiveProductionId(newId);
    
    // Atualiza os dados do formulário com base no novo ID
    if (newId === '102') {
      setProductionRecord({
        id: '102',
        order_number: 'ORD-2025-002',
        batch_number: 'LOT-2025-002',
        employee_id: '2',
        product_id: '2',
        status: 'sendo separado',
        quantity: 75
      });
    } else {
      setProductionRecord({
        id: '101',
        order_number: 'ORD-2025-001',
        batch_number: 'LOT-2025-001',
        employee_id: '1',
        product_id: '1',
        status: 'produzindo',
        quantity: 100
      });
    }
  };

  // Função para obter a cor do chip com base no status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'produzindo':
        return 'success';
      case 'sendo separado':
        return 'info';
      case 'parado':
        return 'error';
      case 'finalizado':
        return 'default';
      default:
        return 'primary';
    }
  };

  // Funções para gerenciar os registros de produção
  const handleAddRecord = (record: ProductionRecord) => {
    console.log('Novo registro adicionado:', record);
  };

  const handleUpdateRecord = (record: ProductionRecord) => {
    console.log('Registro atualizado:', record);
  };

  const handleDeleteRecord = (id: string) => {
    console.log('Registro excluído:', id);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fade-in">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          <FactoryIcon fontSize="large" color="primary" />
          Registro de Produção
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleChangeProduction}
          startIcon={<SwapHorizIcon />}
          sx={{ 
            borderRadius: '8px',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            py: { xs: 0.5, sm: 1 }
          }}
          className="button-hover"
        >
          Alternar Produção
        </Button>
      </Box>
      
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: { xs: '8px', sm: '12px' }, 
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        className="card-hover"
      >
        <CardHeader 
          title={
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Dados da Produção
                </Typography>
              </Box>
              <Chip 
                label={productionRecord.status} 
                color={getStatusColor(productionRecord.status || '')} 
                size="small"
                sx={{ ml: { xs: 0, sm: 2 }, fontWeight: 500 }}
              />
            </Box>
          }
          subheader={
            <Box sx={{ mt: 1 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Ordem: {productionRecord.order_number} | Lote: {productionRecord.batch_number}
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(25, 118, 210, 0.05)', 
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            pb: 1,
            px: { xs: 2, sm: 3 }
          }}
        />
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <ProductionForm 
            initialData={productionRecord} 
            onSubmit={handleFormSubmit} 
            sx={{ 
              '& .MuiFormControl-root': {
                mb: { xs: 1.5, sm: 2 }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              },
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.85rem', sm: '0.9rem' }
              },
              '& .MuiButton-root': {
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 0.5, sm: 1 }
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 4 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Registros de Produção
        </Typography>
        
        <ProductionRecordTable 
          productionId={activeProductionId}
          onAddRecord={handleAddRecord}
          onUpdateRecord={handleUpdateRecord}
          onDeleteRecord={handleDeleteRecord}
          sx={{
            '& .MuiTableCell-root': {
              padding: { xs: '8px 4px', sm: '16px 8px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '& .MuiButton-root': {
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              padding: { xs: '3px 6px', sm: '4px 8px' }
            }
          }}
        />
      </Box>
    </Box>
  );
}
