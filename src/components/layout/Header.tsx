import React from 'react';
import { Stack, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Stack 
      direction="row" 
      alignItems="center"
      spacing={2}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          textAlign: 'center',
          flexGrow: 1,
          color: '#14345c',
          fontWeight: 500
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
};
