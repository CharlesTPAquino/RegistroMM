import React, { useEffect } from 'react';
import { IconButton, Tooltip, useTheme, PaletteMode, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
  const theme = useTheme();

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
      transition: {
        duration: 0.2
      }
    },
    hover: { 
      scale: 1.1,
      rotate: mode === 'dark' ? -30 : 30,
      boxShadow: mode === 'dark' 
        ? '0 0 12px rgba(110, 168, 255, 0.7)' 
        : '0 0 12px rgba(255, 122, 126, 0.7)'
    },
    tap: { scale: 0.9 }
  };

  // Variantes para o ícone
  const iconVariants = {
    initial: { rotate: 0, y: -20, opacity: 0 },
    animate: { 
      rotate: mode === 'dark' ? 360 : 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      rotate: mode === 'dark' ? 0 : 360,
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Variantes para o efeito de brilho
  const glowVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: [0, 0.5, 0],
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={mode === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
        <MotionIconButton
          onClick={toggleColorMode}
          color="inherit"
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className={mode === 'dark' ? 'dark-theme-toggle' : 'light-theme-toggle'}
          sx={{
            ml: 1,
            bgcolor: mode === 'dark' 
              ? 'rgba(110, 168, 255, 0.1)' 
              : 'rgba(255, 122, 126, 0.1)',
            color: mode === 'dark' 
              ? 'var(--color-dark-primary)' 
              : 'var(--color-accent)',
            border: `1px solid ${mode === 'dark' 
              ? 'rgba(110, 168, 255, 0.3)' 
              : 'rgba(255, 122, 126, 0.3)'}`,
            borderRadius: '50%',
            p: 1,
            zIndex: 10,
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: '50%',
              background: mode === 'dark' 
                ? 'radial-gradient(circle, rgba(110, 168, 255, 0.2) 0%, rgba(110, 168, 255, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 122, 126, 0.2) 0%, rgba(255, 122, 126, 0) 70%)',
              zIndex: -1,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            }
          }}
        >
          {/* Efeito de brilho por trás do botão */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: mode === 'dark' 
                ? 'radial-gradient(circle, rgba(110, 168, 255, 0.3) 0%, rgba(110, 168, 255, 0) 70%)' 
                : 'radial-gradient(circle, rgba(255, 122, 126, 0.3) 0%, rgba(255, 122, 126, 0) 70%)',
              zIndex: -1
            }}
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={iconVariants}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </motion.div>
          </AnimatePresence>
        </MotionIconButton>
      </Tooltip>
    </Box>
  );
};
