import { createTheme, PaletteMode } from '@mui/material/styles'

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' 
      ? {
          // Paleta para modo claro
          primary: {
            light: '#4A90E2',
            main: '#1976d2',
            dark: '#1E3D59',
            contrastText: '#fff',
          },
          secondary: {
            light: '#FF8A80',
            main: '#FF5A5F',
            dark: '#C51162',
            contrastText: '#fff',
          },
          background: {
            default: '#f5f7fa',
            paper: '#ffffff',
          },
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
        }
      : {
          // Paleta para modo escuro - cores melhoradas
          primary: {
            light: '#6EA8FF',
            main: '#2196F3',
            dark: '#0B7AD1',
            contrastText: '#fff',
          },
          secondary: {
            light: '#FF8A80',
            main: '#FF5A5F',
            dark: '#C51162',
            contrastText: '#fff',
          },
          background: {
            default: '#121212',
            paper: '#1E1E1E',
          },
          text: {
            primary: '#E0E0E0',
            secondary: '#AAAAAA',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        }),
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.5s ease, color 0.5s ease',
          scrollBehavior: 'smooth',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 8px rgba(0, 0, 0, 0.1)'
              : '0 4px 8px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 6px 10px rgba(0, 0, 0, 0.15)'
              : '0 6px 10px rgba(0, 0, 0, 0.4)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(0, 0, 0, 0.05)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 6px 16px rgba(0, 0, 0, 0.1)' 
              : '0 6px 16px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#f5f7fa' : '#2A2A2A',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: mode === 'light' 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          color: mode === 'light' ? '#333333' : '#E0E0E0',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(0, 0, 0, 0.03)' 
              : 'rgba(255, 255, 255, 0.03)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(0, 0, 0, 0.05)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.05)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(0, 0, 0, 0.03)' 
              : 'rgba(255, 255, 255, 0.03)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
  },
});

// Tema padrão (claro)
export const theme = getTheme('light')
