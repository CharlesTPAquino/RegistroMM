import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
  useTheme,
  Avatar,
  LinearProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion, AnimatePresence } from 'framer-motion';

// Dados de exemplo
const productionStats = {
  activeProductions: 3,
  completedToday: 2,
  totalItems: 450,
  efficiency: 87
};

const recentProductions = [
  { id: '101', order: 'ORD-2025-001', status: 'produzindo', progress: 65, product: 'Produto A', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '102', order: 'ORD-2025-002', status: 'sendo separado', progress: 20, product: 'Produto B', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: '103', order: 'ORD-2025-003', status: 'finalizado', progress: 100, product: 'Produto C', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) }
];

// Componentes com animação
const MotionCard = motion(Card);
const MotionBox = motion(Box);

export const Home: React.FC = () => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Atualiza o horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Função para obter a cor do chip com base no status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'produzindo':
        return 'success';
      case 'sendo separado':
        return 'info';
      case 'parado':
        return 'error';
      case 'finalizado':
        return 'default';
      default:
        return 'primary';
    }
  };

  // Função para formatar o tempo relativo
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  };

  // Animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -12,
      scale: 1.02,
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
        : '0 10px 30px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Animação para o título
  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Animação para o botão
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4
        }}
      >
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #6EA8FF 30%, #2196F3 90%)' 
                : 'linear-gradient(45deg, #1976d2 30%, #4A90E2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Bem-vindo ao Registro MM
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="subtitle1" color="text.secondary">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </MotionBox>
        
        <motion.div
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/production"
            startIcon={<AssignmentIcon />}
            sx={{ 
              mt: { xs: 2, md: 0 },
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #2196F3 30%, #0B7AD1 90%)' 
                : 'linear-gradient(45deg, #1976d2 30%, #1E3D59 90%)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 3px 10px rgba(33, 150, 243, 0.3)' 
                : '0 3px 10px rgba(25, 118, 210, 0.2)',
            }}
          >
            Nova Produção
          </Button>
        </motion.div>
      </Box>

      {/* Cards de estatísticas */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        mb: 4
      }}>
        <Box sx={{ 
          width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
        }}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={0}
            onMouseEnter={() => setHoveredCard('active')}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{ 
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0) 100%)' 
                : 'white',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    mr: 2,
                    transform: hoveredCard === 'active' ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === 'active' 
                      ? '0 0 15px rgba(33, 150, 243, 0.5)' 
                      : 'none'
                  }}
                >
                  <FactoryIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Produções Ativas
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'active' ? 'scale(1.1)' : 'scale(1)',
                  color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
                }}
              >
                {productionStats.activeProductions}
              </Typography>
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Em andamento" 
                color="primary" 
                size="small" 
                sx={{ 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'active' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              />
            </CardContent>
          </MotionCard>
        </Box>

        <Box sx={{ 
          width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
        }}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={1}
            onMouseEnter={() => setHoveredCard('completed')}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{ 
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0) 100%)' 
                : 'white',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'success.main', 
                    mr: 2,
                    transform: hoveredCard === 'completed' ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === 'completed' 
                      ? '0 0 15px rgba(76, 175, 80, 0.5)' 
                      : 'none'
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Concluídas Hoje
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'completed' ? 'scale(1.1)' : 'scale(1)',
                  color: theme.palette.mode === 'dark' ? 'success.light' : 'success.dark',
                }}
              >
                {productionStats.completedToday}
              </Typography>
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Finalizadas" 
                color="success" 
                size="small" 
                sx={{ 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'completed' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              />
            </CardContent>
          </MotionCard>
        </Box>

        <Box sx={{ 
          width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
        }}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={2}
            onMouseEnter={() => setHoveredCard('items')}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{ 
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0) 100%)' 
                : 'white',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'info.main', 
                    mr: 2,
                    transform: hoveredCard === 'items' ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === 'items' 
                      ? '0 0 15px rgba(33, 150, 243, 0.5)' 
                      : 'none'
                  }}
                >
                  <CategoryIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Itens Produzidos
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'items' ? 'scale(1.1)' : 'scale(1)',
                  color: theme.palette.mode === 'dark' ? 'info.light' : 'info.dark',
                }}
              >
                {productionStats.totalItems}
              </Typography>
              <Chip 
                icon={<CategoryIcon />} 
                label="Unidades" 
                color="info" 
                size="small" 
                sx={{ 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'items' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              />
            </CardContent>
          </MotionCard>
        </Box>

        <Box sx={{ 
          width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
        }}>
          <MotionCard 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={3}
            onMouseEnter={() => setHoveredCard('efficiency')}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{ 
              height: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0) 100%)' 
                : 'white',
              border: theme.palette.mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'warning.main', 
                    mr: 2,
                    transform: hoveredCard === 'efficiency' ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === 'efficiency' 
                      ? '0 0 15px rgba(255, 152, 0, 0.5)' 
                      : 'none'
                  }}
                >
                  <SpeedIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Eficiência
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'efficiency' ? 'scale(1.1)' : 'scale(1)',
                  color: theme.palette.mode === 'dark' ? 'warning.light' : 'warning.dark',
                }}
              >
                {productionStats.efficiency}%
              </Typography>
              <Chip 
                icon={<TrendingUpIcon />} 
                label="Acima da meta" 
                color="warning" 
                size="small" 
                sx={{ 
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === 'efficiency' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              />
            </CardContent>
          </MotionCard>
        </Box>
      </Box>

      {/* Produções recentes */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            '&::after': {
              content: '""',
              display: 'block',
              height: '2px',
              width: '100%',
              maxWidth: '100px',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, rgba(33,150,243,0.8) 0%, rgba(33,150,243,0) 100%)' 
                : 'linear-gradient(90deg, rgba(25,118,210,0.8) 0%, rgba(25,118,210,0) 100%)',
              marginLeft: 2,
              borderRadius: '2px'
            }
          }}
        >
          <AssignmentIcon color="primary" />
          Produções Recentes
        </Typography>
      </MotionBox>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3 
      }}>
        <AnimatePresence>
          {recentProductions.map((production, index) => (
            <Box 
              key={production.id}
              sx={{ 
                width: { xs: '100%', md: 'calc(33.33% - 16px)' }
              }}
            >
              <MotionCard 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index + 4}
                layoutId={`production-${production.id}`}
                sx={{ 
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(135deg, rgba(30,30,30,1) 0%, rgba(40,40,40,1) 100%)' 
                    : 'white',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.05)' 
                    : 'none',
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6">
                        Ordem: {production.order}
                      </Typography>
                      <Chip 
                        label={production.status} 
                        color={getStatusColor(production.status)} 
                        size="small"
                        sx={{ 
                          fontWeight: 500,
                          boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                        }}
                      />
                    </Box>
                  }
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Produto: {production.product}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                        }}
                      >
                        <AccessTimeIcon fontSize="inherit" />
                        {getRelativeTime(production.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progresso
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {production.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={production.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: production.status === 'finalizado'
                            ? 'linear-gradient(90deg, rgba(76,175,80,0.8) 0%, rgba(76,175,80,1) 100%)'
                            : production.status === 'produzindo'
                              ? 'linear-gradient(90deg, rgba(33,150,243,0.8) 0%, rgba(33,150,243,1) 100%)'
                              : 'linear-gradient(90deg, rgba(255,152,0,0.8) 0%, rgba(255,152,0,1) 100%)',
                          boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none',
                        }
                      }} 
                    />
                  </Box>
                  <Divider sx={{ 
                    my: 2,
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component={RouterLink}
                      to="/production"
                      sx={{ 
                        borderRadius: '8px',
                        borderWidth: '1.5px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderWidth: '1.5px',
                          transform: 'translateY(-2px)',
                          boxShadow: theme.palette.mode === 'dark' 
                            ? '0 4px 8px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      component={RouterLink}
                      to="/production"
                      sx={{ 
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(45deg, #2196F3 30%, #0B7AD1 90%)' 
                          : 'linear-gradient(45deg, #1976d2 30%, #1E3D59 90%)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.palette.mode === 'dark' 
                            ? '0 4px 8px rgba(33, 150, 243, 0.3)' 
                            : '0 4px 8px rgba(25, 118, 210, 0.2)',
                        }
                      }}
                    >
                      Atualizar
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
