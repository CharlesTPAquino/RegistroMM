import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { theme } from './theme';
import { ProductionForm } from './features/production/ProductionForm';
import { EmployeeList } from './features/employee/EmployeeList';
import { ProductList } from './features/product/ProductList';
import { TabMenu } from './components/TabMenu';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/RegistroMM">
        <div>
          <TabMenu />
          <Routes>
            <Route path="/" element={<ProductionForm />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;