import React, { useState } from 'react'
import { Box, Tab, Tabs, Typography, useTheme, Badge, Tooltip } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeIcon from '@mui/icons-material/Home';
import FactoryIcon from '@mui/icons-material/Factory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';

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
      case '/inventory':
        return 4
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
      case 4:
        navigate('/inventory')
        break
    }
  }

  // Animações
  const titleVariants = {
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
    },
    { 
      icon: <InventoryIcon />, 
      label: "Estoque", 
      tooltip: "Gerenciar estoque"
    }
  ];

  return (
    <Box>
      <MotionBox 
        className="title-container"
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: { xs: 2, sm: 3 },
          mt: { xs: 1, sm: 2 },
          mx: 'auto',
          width: { xs: '100%', sm: '90%', md: '80%' },
          maxWidth: '600px',
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '40%', sm: '30%', md: '20%' },
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(var(--primary-color), 0.7), transparent)',
            borderRadius: '2px'
          }
        }}
      >
        <motion.div className="logo-text" style={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            letterSpacing: '0.5px',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)' 
              : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
            padding: { xs: '0.5rem 0', sm: '0.75rem 0' }
          }}>
            Mistura e Manipulação
          </Typography>
        </motion.div>
      </MotionBox>

      <MotionBox 
        className="tabs-container"
        initial="hidden"
        animate="visible"
        variants={tabsVariants}
        sx={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center',
          WebkitOverflowScrolling: 'touch', 
          scrollbarWidth: 'thin', 
          msOverflowStyle: 'none',
          position: 'relative',
          mb: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            height: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: '4px'
          },
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '24px',
            pointerEvents: 'none',
            opacity: 0.8,
            display: { xs: 'block', md: 'none' }
          },
          '&::before': {
            left: 0,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(270deg, rgba(18,18,18,0) 0%, rgba(18,18,18,1) 100%)'
              : 'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
          },
          '&::after': {
            right: 0,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, rgba(18,18,18,0) 0%, rgba(18,18,18,1) 100%)'
              : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
          }
        }}
      >
        <Tabs
          value={getTabValue()}
          onChange={handleChange}
          className="tabs-list"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: '36px', sm: '48px' },
            maxWidth: '100%',
            width: { xs: '100%', sm: '90%', md: '80%' },
            margin: '0 auto',
            '& .MuiTabs-flexContainer': {
              gap: { xs: 1, sm: 2, md: 3 },
              justifyContent: { sm: 'center' }
            },
            '& .MuiTabs-indicator': {
              height: '3px',
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              minHeight: { xs: '36px', sm: '48px' },
              padding: { xs: '6px 12px', sm: '8px 20px' },
              minWidth: { xs: 'auto', sm: '100px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.2s ease',
              flex: { xs: '1 0 auto', sm: '0 0 auto' },
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                fontWeight: 600,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)'
              },
              '&:active': {
                transform: 'scale(0.96)',
                transition: 'transform 0.1s'
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            },
            '& .MuiTabs-scrollButtons': {
              width: { xs: '28px', sm: '40px' },
              height: { xs: '28px', sm: '40px' },
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
              margin: { xs: '0 4px', sm: '0 8px' },
              '&.Mui-disabled': {
                opacity: 0.3
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
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              minWidth: { xs: '16px', sm: '20px' },
                              height: { xs: '16px', sm: '20px' },
                              padding: { xs: '0 4px', sm: '0 6px' }
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
                  marginRight: { xs: '1px', sm: '2px' },
                  '& .MuiTab-iconWrapper': {
                    marginRight: { xs: '4px', sm: '8px' },
                    marginBottom: '0 !important'
                  },
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
