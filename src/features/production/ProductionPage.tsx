/** @jsxImportSource react */
import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardHeader, Chip } from '@mui/material';
import { ProductionForm } from './ProductionForm';
import { ProductionRecordTable } from './ProductionRecordTable';
import { ProductionRecord } from '../../types/ProductionRecord';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FactoryIcon from '@mui/icons-material/Factory';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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

  const handleDeleteRecord = (recordId: string) => {
    console.log('Registro excluído:', recordId);
    // Aqui você implementaria a lógica para excluir o registro
  };

  // Função para gerar relatório PDF usando a API de impressão do navegador
  const generatePdfReport = () => {
    try {
      // Criar um elemento temporário para o conteúdo do relatório
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert('Por favor, permita popups para gerar o relatório PDF.');
        return;
      }
      
      // Dados de exemplo para os operadores
      const operators = [
        { id: '1', name: 'João Silva', role: 'Farmacêutico', active: true },
        { id: '2', name: 'Maria Oliveira', role: 'Técnico', active: true },
        { id: '3', name: 'Pedro Santos', role: 'Auxiliar', active: true },
      ];
      
      // Dados de exemplo para os registros hora a hora
      const hourlyRecords = [
        {
          id: '1',
          production_id: activeProductionId,
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
          production_id: activeProductionId,
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
          production_id: activeProductionId,
          timestamp: '2025-04-07T10:00:00',
          status: 'produzindo',
          notes: 'Aumento de temperatura',
          quantity_produced: 50,
          temperature: 26.5,
          pressure: 1.2,
          operator_id: '2'
        },
        {
          id: '4',
          production_id: activeProductionId,
          timestamp: '2025-04-07T11:00:00',
          status: 'produzindo',
          notes: 'Produção estável',
          quantity_produced: 75,
          temperature: 26.0,
          pressure: 1.1,
          operator_id: '2'
        }
      ];
      
      // Criar o conteúdo HTML do relatório
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Registros Hora a Hora - ${activeProductionId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2980b9; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2980b9; color: white; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Registros Hora a Hora</h1>
          
          <div class="info">
            <p><strong>ID da Produção:</strong> ${activeProductionId}</p>
            <p><strong>Ordem:</strong> ${productionRecord.order_number}</p>
            <p><strong>Lote:</strong> ${productionRecord.batch_number}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Operador</th>
                <th>Status</th>
                <th>Qtd. Produzida</th>
                <th>Temperatura</th>
                <th>Pressão</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              ${hourlyRecords.map(record => `
                <tr>
                  <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                  <td>${new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  <td>${operators.find(op => op.id === record.operator_id)?.name || 'N/A'}</td>
                  <td>${record.status}</td>
                  <td>${record.quantity_produced}</td>
                  <td>${record.temperature ? `${record.temperature} °C` : 'N/A'}</td>
                  <td>${record.pressure ? `${record.pressure} bar` : 'N/A'}</td>
                  <td>${record.notes || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Relatório gerado em ${new Date().toLocaleString()}</p>
          </div>
          
          <button onclick="window.print(); return false;" style="margin-top: 20px; padding: 10px 15px; background-color: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir / Salvar como PDF
          </button>
        </body>
        </html>
      `;
      
      // Escrever o conteúdo na nova janela
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      
      console.log('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.');
    }
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
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={generatePdfReport}
            sx={{ 
              borderRadius: '8px',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 }
            }}
          >
            Relatório Hora a Hora
          </Button>
        </Box>
        
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
