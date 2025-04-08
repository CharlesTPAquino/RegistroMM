import React, { useState } from 'react'
import { Box, Tab, Tabs, Typography, useTheme, Badge, Tooltip } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeIcon from '@mui/icons-material/Home';
import FactoryIcon from '@mui/icons-material/Factory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';

// Componente com animação
const MotionBox = motion(Box);

export function TabMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const [hoverTab, setHoverTab] = useState<number | null>(null);

  const getTabValue = () => {
    switch (location.pathname) {
      case '/':
        return 0
      case '/production':
        return 1
      case '/employees':
        return 2
      case '/products':
        return 3
      default:
        return 0
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/production')
        break
      case 2:
        navigate('/employees')
        break
      case 3:
        navigate('/products')
        break
    }
  }

  // Animações
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const tabsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Animação para o ícone do tab
  const iconVariants = {
    initial: { y: 0, scale: 1 },
    hover: { 
      y: -2, 
      scale: 1.2,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Dados dos tabs
  const tabData = [
    { 
      icon: <HomeIcon />, 
      label: "Início", 
      tooltip: "Página inicial com estatísticas"
    },
    { 
      icon: <FactoryIcon />, 
      label: "Produção", 
      tooltip: "Gerenciar registros de produção",
      badge: 3 // Exemplo de notificação
    },
    { 
      icon: <PeopleIcon />, 
      label: "Funcionários", 
      tooltip: "Gerenciar funcionários"
    },
    { 
      icon: <CategoryIcon />, 
      label: "Produtos", 
      tooltip: "Gerenciar produtos"
    }
  ];

  return (
    <Box>
      <MotionBox 
        className="title-container"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={logoVariants}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 1,
          cursor: 'pointer',
          '&:hover': {
            '& .logo-text': {
              letterSpacing: '1.2px',
            }
          }
        }}
        onClick={() => navigate('/')}
      >
        <motion.div className="logo-text">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              letterSpacing: 1,
              color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
              transition: 'letter-spacing 0.3s ease'
            }}
          >
            MISTURA
          </Typography>
        </motion.div>
        <motion.div className="logo-text">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              letterSpacing: 1,
              color: 'primary.main',
              transition: 'letter-spacing 0.3s ease'
            }}
          >
            MANIPULAÇÃO
          </Typography>
        </motion.div>
        <motion.div className="logo-text">
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              letterSpacing: 1,
              color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
              transition: 'letter-spacing 0.3s ease'
            }}
          >
            MISTURA
          </Typography>
        </motion.div>
      </MotionBox>

      <MotionBox 
        className="tabs-container"
        initial="hidden"
        animate="visible"
        variants={tabsVariants}
      >
        <Tabs
          value={getTabValue()}
          onChange={handleChange}
          className="tabs-list"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, rgba(33,150,243,1) 0%, rgba(110,168,255,1) 100%)' 
                : 'linear-gradient(90deg, rgba(25,118,210,1) 0%, rgba(74,144,226,1) 100%)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 0 8px rgba(33,150,243,0.5)' 
                : 'none',
            },
            '& .MuiTab-root': {
              minHeight: '48px',
              transition: 'all 0.3s ease',
              opacity: 0.7,
              '&.Mui-selected': {
                opacity: 1,
                fontWeight: 600,
              },
              '&:hover': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                borderRadius: '8px 8px 0 0',
              }
            },
            '& .MuiTabs-scrollButtons': {
              transition: 'all 0.3s ease',
              '&.Mui-disabled': {
                opacity: 0.3,
              },
              '&:not(.Mui-disabled)': {
                opacity: 0.8,
              },
              '&:hover:not(.Mui-disabled)': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
                borderRadius: '8px',
              }
            }
          }}
        >
          {tabData.map((tab, index) => (
            <Tooltip key={index} title={tab.tooltip} arrow>
              <Tab 
                icon={
                  <Box sx={{ position: 'relative' }}>
                    <motion.div
                      variants={iconVariants}
                      initial="initial"
                      animate={hoverTab === index ? "hover" : "initial"}
                    >
                      {tab.badge ? (
                        <Badge 
                          badgeContent={tab.badge} 
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              animation: 'pulse 2s infinite',
                              transition: 'all 0.3s ease',
                            }
                          }}
                        >
                          {tab.icon}
                        </Badge>
                      ) : tab.icon}
                    </motion.div>
                  </Box>
                } 
                label={tab.label} 
                className="tab-button" 
                iconPosition="start"
                onMouseEnter={() => setHoverTab(index)}
                onMouseLeave={() => setHoverTab(null)}
                sx={{
                  borderRadius: '8px 8px 0 0',
                  marginRight: '2px',
                  '&.Mui-selected': {
                    color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                  }
                }}
              />
            </Tooltip>
          ))}
        </Tabs>
      </MotionBox>
    </Box>
  )
}
