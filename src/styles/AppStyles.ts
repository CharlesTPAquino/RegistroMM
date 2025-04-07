import { SxProps, Theme } from '@mui/material/styles';

// Tipos para os estilos
export interface StyleProps {
  theme?: Theme;
}

// Estilos para o contêiner principal
export const containerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f5f5f5'
};

// Estilos para o cabeçalho
export const headerStyles: SxProps<Theme> = {
  textAlign: 'center',
  flexGrow: 1,
  color: '#14345c',
  fontWeight: 500
};

// Estilos para as Tabs
export const tabsContainerStyles: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: 'divider',
  mb: 3
};

export const tabsStyles: SxProps<Theme> = {
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 120,
    fontWeight: 'bold'
  }
};

// Estilos para alertas
export const alertStyles: SxProps<Theme> = {
  mb: 2
};

// Estilos para cards e formulários
export const paperStyles: SxProps<Theme> = {
  p: 3,
  mb: 3
};

export const titleStyles: SxProps<Theme> = {
  textAlign: 'center',
  flexGrow: 1,
  color: '#14345c',
  fontWeight: 500
};

// Estilos aprimorados para formulários
export const formGroupStyles: SxProps<Theme> = {
  mb: 2
};

export const buttonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 2
};

export const primaryButtonStyles: SxProps<Theme> = {
  mr: 1
};

export const secondaryButtonStyles: SxProps<Theme> = {
  mr: 1
};

export const dangerButtonStyles: SxProps<Theme> = {
  backgroundColor: 'error.main',
  '&:hover': {
    backgroundColor: 'error.dark'
  }
};

// Estilos para listas
export const listContainerStyles: SxProps<Theme> = {
  width: '100%',
  bgcolor: 'background.paper'
};

export const listItemStyles: SxProps<Theme> = {
  borderBottom: '1px solid',
  borderColor: 'divider'
};

// Estilos para footer
export const footerStyles: SxProps<Theme> = {
  mt: 'auto',
  py: 3,
  backgroundColor: 'primary.main',
  color: 'white'
};
