/** @jsxImportSource react */
import { useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Chip } from '@mui/material';
import { RawMaterialTable } from './RawMaterialTable';
import { RawMaterial } from '../../types/RawMaterial';
import InventoryIcon from '@mui/icons-material/Inventory';

export function InventoryPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  
  // Função para adicionar uma nova matéria prima
  const handleAddMaterial = (material: RawMaterial) => {
    setMaterials(prevMaterials => [...prevMaterials, material]);
  };
  
  // Função para atualizar uma matéria prima existente
  const handleUpdateMaterial = (updatedMaterial: RawMaterial) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => 
        material.id === updatedMaterial.id ? updatedMaterial : material
      )
    );
  };
  
  // Função para excluir uma matéria prima
  const handleDeleteMaterial = (id: string) => {
    setMaterials(prevMaterials => 
      prevMaterials.filter(material => material.id !== id)
    );
  };
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        <InventoryIcon color="primary" fontSize="large" />
        Controle de Estoque
      </Typography>
      
      <Card sx={{ 
        mb: 4, 
        borderRadius: { xs: '12px', sm: '16px' },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        <CardHeader
          title={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexWrap: 'wrap'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <InventoryIcon color="primary" />
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Matérias Primas
                </Typography>
              </Box>
              <Chip 
                label="Estoque" 
                color="primary" 
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
                Controle de estoque de matérias primas, excipientes e embalagens
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
          <RawMaterialTable 
            materials={materials}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
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
        </CardContent>
      </Card>
    </Box>
  );
}
