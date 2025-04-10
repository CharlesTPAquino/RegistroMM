import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RegistroMM - Dashboard
          </Typography>
          
          {/* Navegação */}
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/production">Produção</Button>
          <Button color="inherit" component={Link} to="/inventory">Estoque</Button>
          
          {/* Controle de acesso */}
          {user && (
            <Button color="inherit" onClick={logout}>
              Sair
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>

      {/* Rodapé */}
      <Box component="footer" sx={{ py: 2, px: 3, bgcolor: 'grey.100' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} RegistroMM - Todos os direitos reservados
        </Typography>
      </Box>
    </Box>
  );
}
