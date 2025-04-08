import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Paper, PaletteMode, useMediaQuery } from '@mui/material';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { getTheme } from './theme';
import { ProductionPage } from './features/production/ProductionPage';
import { EmployeeList } from './features/employee/EmployeeList';
import { ProductList } from './features/product/ProductList';
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
  
  // Variantes de animação para as páginas
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
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
  useEffect(() => {
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

  // Gera o tema com base no modo atual
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Variantes para a animação do container principal
  const containerVariants = {
    initial: { opacity: 0.9, scale: 0.98 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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
            maxWidth="xl" 
            component={motion.div}
            initial="initial"
            animate="animate"
            variants={containerVariants}
            sx={{ 
              px: { xs: 2, md: 3 },
              pt: 2,
              pb: 4
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              mb: 2
            }}>
              <TabMenu />
              <ThemeToggle mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
            
            <AnimatedPaper 
              elevation={mode === 'dark' ? 4 : 2} 
              sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                minHeight: 'calc(100vh - 120px)',
                mb: 4,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                background: mode === 'dark' 
                  ? 'linear-gradient(145deg, rgba(36,36,36,1) 0%, rgba(30,30,30,1) 100%)' 
                  : 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(245,245,245,1) 100%)',
                boxShadow: mode === 'dark'
                  ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PageTransition />
            </AnimatedPaper>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;