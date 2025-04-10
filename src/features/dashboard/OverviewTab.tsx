/** @jsxImportSource react */
import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar, 
  Divider,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FactoryIcon from '@mui/icons-material/Factory';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { Grid as CustomGrid } from '../../components/CustomGrid';

// Importando os tipos
import { Product } from '../../types/Product';
import { Employee } from '../../types/Employee';
import { ProductionRecord } from '../../types/ProductionRecord';
import { RawMaterial } from '../../types/RawMaterial';
import { HourlyRecord } from '../../types/HourlyRecord';

// Componentes com animação
const MotionCard = motion(Card);

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Interface para as propriedades do componente
interface OverviewTabProps {
  products: Product[];
  employees: Employee[];
  productionRecords: ProductionRecord[];
  rawMaterials: RawMaterial[];
  hourlyRecords: HourlyRecord[];
}

export function OverviewTab({ 
  products, 
  employees, 
  productionRecords, 
  rawMaterials, 
  hourlyRecords 
}: OverviewTabProps) {
  const theme = useTheme();

  console.log('OverviewTab Props:', {
    products: products.length,
    employees: employees.length,
    productionRecords: productionRecords.length,
    rawMaterials: rawMaterials.length,
    hourlyRecords: hourlyRecords.length
  });

  return (
    <Box sx={{ 
      width: '100%', 
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default 
    }}>
      <CustomGrid container spacing={3}>
        <CustomGrid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Produtos Ativos</Typography>
              <Typography variant="h4">
                {products.filter(p => p.active).length}
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Funcionários Ativos</Typography>
              <Typography variant="h4">
                {employees.filter(e => e.active).length}
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Produções em Andamento</Typography>
              <Typography variant="h4">
                {productionRecords.filter(p => 
                  p.status === 'produzindo' || p.status === 'sendo separado'
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>

        <CustomGrid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Matérias Primas</Typography>
              <Typography variant="h4">
                {rawMaterials.length}
              </Typography>
            </CardContent>
          </Card>
        </CustomGrid>
      </CustomGrid>
    </Box>
  );
}
