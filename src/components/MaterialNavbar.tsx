import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  Box,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';

export default function MaterialNavbar() {
  const [teamMenuAnchor, setTeamMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  const handleTeamMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTeamMenuAnchor(event.currentTarget);
  };
  
  const handleTeamMenuClose = () => {
    setTeamMenuAnchor(null);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        {/* Logo e Menu de Equipes */}
        <Button
          onClick={handleTeamMenuOpen}
          startIcon={<Avatar src="/logo-sistema.png" sx={{ width: 24, height: 24 }} />}
          endIcon={<ArrowDropDownIcon />}
          sx={{ 
            textTransform: 'none',
            mr: 2,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500, ml: 1 }}>
            Sistema de Produção
          </Typography>
        </Button>
        
        {/* Menu de Equipes */}
        <Menu
          anchorEl={teamMenuAnchor}
          open={Boolean(teamMenuAnchor)}
          onClose={handleTeamMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ 
            '& .MuiPaper-root': { 
              width: 220, 
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: 1
            } 
          }}
        >
          <MenuItem onClick={handleTeamMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleTeamMenuClose}>
            <ListItemIcon>
              <Avatar src="/logo-sistema.png" sx={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary="Sistema de Produção" />
          </MenuItem>
          
          <MenuItem onClick={handleTeamMenuClose}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'purple.500', width: 24, height: 24, fontSize: '0.8rem' }}>
                FR
              </Avatar>
            </ListItemIcon>
            <ListItemText primary="Funcionários" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleTeamMenuClose}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Nova equipe..." />
          </MenuItem>
        </Menu>
        
        {/* Links de Navegação */}
        <Divider orientation="vertical" flexItem sx={{ height: 24, mx: 1, display: { xs: 'none', md: 'block' } }} />
        
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button 
            color="primary"
            sx={{ 
              textTransform: 'none',
              borderBottom: '2px solid',
              borderRadius: 0,
              px: 2
            }}
          >
            Home
          </Button>
          <Button 
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              px: 2,
              '&:hover': { color: 'text.primary' }
            }}
          >
            Funcionários
          </Button>
          <Button 
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              px: 2,
              '&:hover': { color: 'text.primary' }
            }}
          >
            Produtos
          </Button>
        </Box>
        
        {/* Espaçador */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Ícones de Ação */}
        <IconButton size="large" color="inherit">
          <SearchIcon />
        </IconButton>
        
        <IconButton size="large" color="inherit">
          <MailIcon />
        </IconButton>
        
        {/* Menu de Usuário */}
        <IconButton onClick={handleUserMenuOpen} size="small" sx={{ ml: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }} alt="Profile" src="/profile-photo.jpg" />
        </IconButton>
        
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ 
            '& .MuiPaper-root': { 
              width: 220, 
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: 1
            } 
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Meu perfil" />
          </MenuItem>
          
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sair do sistema" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
