import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import ProductionForm from './features/production/ProductionForm';
import EmployeeList from './features/employee/EmployeeList';
import ProductList from './features/product/ProductList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-container">
        <div className="title-container">
          <div className="title-text">MISTURA</div>
          <div className="title-text blue">MANIPULAÇÃO</div>
          <div className="title-text">MISTURA</div>
        </div>

        <Box className="tabs-container">
          <Tabs
            value={value}
            onChange={handleChange}
            className="tabs-list"
          >
            <Tab label="Produção" className="tab-button" />
            <Tab label="Funcionários" className="tab-button" />
            <Tab label="Produtos" className="tab-button" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <ProductionForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EmployeeList />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProductList />
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
}

export default App;