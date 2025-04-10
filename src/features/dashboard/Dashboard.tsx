/** @jsxImportSource react */
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';

import { OverviewTab } from './OverviewTab';
import { ProductionTab } from './ProductionTab';
import { InventoryTab } from './InventoryTab';
import { EmployeeTab } from './EmployeeTab';

// Importando os tipos
import { Product } from '../../types/Product';
import { Employee } from '../../types/Employee';
import { ProductionRecord } from '../../types/ProductionRecord';
import { RawMaterial } from '../../types/RawMaterial';
import { HourlyRecord } from '../../types/HourlyRecord';

// Interface para as propriedades da página
interface DashboardProps {}

export function Dashboard({}: DashboardProps) {
  // Gerar dados mock
  const [products, setProducts] = useState<Product[]>(generateMockProducts());
  const [employees, setEmployees] = useState<Employee[]>(generateMockEmployees());
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>(generateMockProductionRecords());
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(generateMockRawMaterials());
  const [hourlyRecords, setHourlyRecords] = useState<HourlyRecord[]>(generateMockHourlyRecords());

  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log('Dashboard Data:', {
    products: products.length,
    employees: employees.length,
    productionRecords: productionRecords.length,
    rawMaterials: rawMaterials.length,
    hourlyRecords: hourlyRecords.length
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default 
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          marginBottom: theme.spacing(3),
          textAlign: 'center',
          color: theme.palette.text.primary 
        }}
      >
        Painel de Controle
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: theme.spacing(3) }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile}
          allowScrollButtonsMobile
        >
          <Tab label="Visão Geral" />
          <Tab label="Produção" />
          <Tab label="Estoque" />
          <Tab label="Funcionários" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 0 && <OverviewTab 
            products={products}
            employees={employees}
            productionRecords={productionRecords}
            rawMaterials={rawMaterials}
            hourlyRecords={hourlyRecords}
          />}
          
        {activeTab === 1 && <ProductionTab 
            products={products}
            productionRecords={productionRecords}
            hourlyRecords={hourlyRecords}
          />}
          
        {activeTab === 2 && <InventoryTab 
            products={products}
            rawMaterials={rawMaterials}
          />}
          
        {activeTab === 3 && <EmployeeTab 
            employees={employees}
            productionRecords={productionRecords}
          />}
      </Box>
    </Box>
  );
}

// Funções para gerar dados simulados
function generateMockProducts(): Product[] {
  const productTypes = [
    'Gel Construtor', 
    'Capa Base Flex', 
    'Capa Base Estrutural', 
    'TopCoat', 
    'TopCoat Shine', 
    'Gel Gummy', 
    'Banho de Fibra', 
    'Gel Shine'
  ];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Produto ${i + 1}`,
    code: `P${1000 + i}`,
    active: Math.random() > 0.2,
    category: Math.random() > 0.5 ? 'Gel' : 'Base',
    stock: Math.floor(Math.random() * 100),
    price: parseFloat((Math.random() * 100 + 50).toFixed(2)),
    type: productTypes[Math.floor(Math.random() * productTypes.length)] as any,
    batch_number: `L${2000 + i}`,
    manufacturing_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    order_number: `O${3000 + i}`
  }));
}

function generateMockEmployees(): Employee[] {
  const roles = ['Operador', 'Supervisor', 'Químico', 'Auxiliar', 'Gerente'];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `emp-${i + 1}`,
    name: `Funcionário ${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    active: Math.random() > 0.1
  }));
}

function generateMockProductionRecords(): ProductionRecord[] {
  const statuses = ['produzindo', 'sendo separado', 'parado', 'finalizado'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const startDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const endDate = Math.random() > 0.3 
      ? new Date(startDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) 
      : undefined;
    
    return {
      id: `pr-${i + 1}`,
      employee_id: `emp-${Math.floor(Math.random() * 8) + 1}`,
      product_id: `prod-${Math.floor(Math.random() * 15) + 1}`,
      order_number: `O${3000 + Math.floor(Math.random() * 100)}`,
      batch_number: `L${2000 + Math.floor(Math.random() * 100)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      start_time: startDate.toISOString(),
      end_time: endDate?.toISOString(),
      quantity: Math.floor(Math.random() * 500) + 50,
      observations: Math.random() > 0.7 ? `Observação para produção ${i + 1}` : undefined
    };
  });
}

function generateMockRawMaterials(): RawMaterial[] {
  const types = ['Matéria-Prima', 'Excipiente', 'Embalagem', 'Insumo'];
  const suppliers = ['Fornecedor A', 'Fornecedor B', 'Fornecedor C', 'Fornecedor D'];
  const locations = ['Almoxarifado A', 'Almoxarifado B', 'Sala de Insumos', 'Depósito'];
  
  return Array.from({ length: 12 }, (_, i) => {
    const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const expirationDate = new Date(Date.now() + (Math.random() * 365 - 30) * 24 * 60 * 60 * 1000);
    
    return {
      id: `rm-${i + 1}`,
      name: `Matéria Prima ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      quantity: parseFloat((Math.random() * 100 + 10).toFixed(2)),
      batch_number: `B${4000 + i}`,
      expiration_date: expirationDate.toISOString(),
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      storage_location: locations[Math.floor(Math.random() * locations.length)],
      notes: Math.random() > 0.6 ? `Notas para matéria prima ${i + 1}` : undefined,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString()
    };
  });
}

function generateMockHourlyRecords(): HourlyRecord[] {
  const statuses = ['produzindo', 'sendo separado', 'parado', 'finalizado'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: `hr-${i + 1}`,
      production_id: `pr-${Math.floor(Math.random() * 20) + 1}`,
      timestamp: timestamp.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      notes: Math.random() > 0.8 ? `Nota para registro horário ${i + 1}` : undefined,
      quantity_produced: Math.floor(Math.random() * 50) + 5,
      temperature: Math.random() > 0.3 ? parseFloat((Math.random() * 30 + 20).toFixed(1)) : undefined,
      pressure: Math.random() > 0.3 ? parseFloat((Math.random() * 5 + 1).toFixed(2)) : undefined,
      operator_id: `emp-${Math.floor(Math.random() * 8) + 1}`
    };
  });
}
