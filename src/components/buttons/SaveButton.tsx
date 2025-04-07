import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

interface SaveButtonProps extends ButtonProps {
  loading: boolean;
  actionText: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  loading, 
  actionText,
  ...props 
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
      disabled={loading}
      {...props}
    >
      {loading ? 'Salvando...' : actionText}
    </Button>
  );
};
