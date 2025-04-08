import React, { useEffect } from 'react';
import { IconButton, Tooltip, PaletteMode, Box } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

// Componente com animação
const MotionIconButton = motion(IconButton);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, toggleColorMode }) => {
  // Adicionar/remover classe no body quando o tema mudar
  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Adicionar uma classe temporária para a animação de transição
    document.body.classList.add('theme-transition');
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [mode]);

  // Variantes de animação
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box sx={{ ml: 1 }}>
      <Tooltip title={mode === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'dark' ? (
            <MotionIconButton
              key="dark-mode"
              onClick={toggleColorMode}
              color="inherit"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              aria-label="dark mode"
            >
              <LightModeIcon />
            </MotionIconButton>
          ) : (
            <MotionIconButton
              key="light-mode"
              onClick={toggleColorMode}
              color="inherit"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              aria-label="light mode"
            >
              <DarkModeIcon />
            </MotionIconButton>
          )}
        </AnimatePresence>
      </Tooltip>
    </Box>
  );
};
