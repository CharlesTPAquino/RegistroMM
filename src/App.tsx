import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Paper, PaletteMode, useMediaQuery } from '@mui/material';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getTheme } from './theme';
import { ProductionPage } from './features/production/ProductionPage';
import { EmployeeList } from './features/employee/EmployeeList';
import { ProductList } from './features/product/ProductList';
import { InventoryPage } from './features/inventory/InventoryPage';
import { TabMenu } from './components/TabMenu';
import { ThemeToggle } from './components/ThemeToggle';
import { Home } from './features/home/Home';
import { AnimatePresence, motion } from 'framer-motion';

// Componente de animação para as páginas
const AnimatedPage = motion(Box);
const AnimatedPaper = motion(Paper);

// Componente para gerenciar as transições de página
const PageTransition = () => {
  const location = useLocation();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Variantes de animação para as páginas
  const pageVariants = {
    initial: isMobile 
      ? { opacity: 0, x: 100 } 
      : { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: isMobile 
      ? { opacity: 0, x: -100, transition: { duration: 0.25, ease: "easeIn" } }
      : { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Variantes para elementos filhos dentro das páginas
  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <AnimatedPage
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className={prefersDarkMode ? 'dark-mode-page' : 'light-mode-page'}
        sx={{ 
          width: '100%', 
          height: '100%',
          overflowX: 'hidden', // Evita barras de rolagem horizontais durante a animação
          '& .MuiPaper-root, & .MuiCard-root': {
            variants: childVariants
          }
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </AnimatedPage>
    </AnimatePresence>
  );
};

function App() {
  // Estado para controlar o modo do tema (claro/escuro)
  const [mode, setMode] = useState<PaletteMode>(() => {
    // Recuperar a preferência do usuário do localStorage
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  // Estado para controlar a animação de transição
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Função para alternar entre os modos de tema
  const toggleColorMode = () => {
    setIsTransitioning(true);
    
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Salvar a preferência do usuário no localStorage
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
    
    // Remover o estado de transição após a animação
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // Efeito para sincronizar o tema com a preferência do sistema
  React.useEffect(() => {
    // Verifica se o usuário prefere o tema escuro no sistema
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Se não houver preferência salva, use a preferência do sistema
    if (!localStorage.getItem('themeMode')) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
    
    // Adicionar listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Só atualiza se o usuário não tiver uma preferência explícita
      if (!localStorage.getItem('themeMode')) {
        setIsTransitioning(true);
        setMode(e.matches ? 'dark' : 'light');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Tema atual baseado no modo
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          className={isTransitioning ? 'theme-transition' : ''}
        >
          {/* Overlay de transição */}
          {isTransitioning && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: mode === 'dark' ? '#fff' : '#000',
                zIndex: 9999,
                pointerEvents: 'none'
              }}
            />
          )}
          
          <Container 
            component={motion.div}
            maxWidth="xl" 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              pt: { xs: 2, sm: 3, md: 4 },
              pb: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, transparent, rgba(var(--primary-color), 0.7), transparent)',
                opacity: 0.8,
                zIndex: 1
              }
            }}
          >
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              position: 'relative',
              zIndex: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: { xs: 1, sm: 2 },
                mx: 'auto',
                width: '100%',
                maxWidth: { xs: '100%', sm: '95%', md: '90%' }
              }}>
                <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
              </Box>
              
              <TabMenu />
            
              <AnimatedPaper 
                elevation={mode === 'dark' ? 4 : 2} 
                sx={{ 
                  borderRadius: { xs: '16px', sm: '20px' }, 
                  overflow: 'hidden',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: { xs: 'calc(100vh - 160px)', sm: 'calc(100vh - 120px)' },
                  mb: { xs: 2, sm: 4 },
                  mx: 'auto',
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '95%', md: '90%' },
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: mode === 'dark' 
                    ? 'linear-gradient(145deg, rgba(36,36,36,1) 0%, rgba(30,30,30,1) 100%)' 
                    : 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)',
                  boxShadow: mode === 'dark'
                    ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, rgba(var(--primary-color), 0.5), transparent)',
                    opacity: 0.6
                  }
                }}
              >
                <PageTransition />
              </AnimatedPaper>
            </Box>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;