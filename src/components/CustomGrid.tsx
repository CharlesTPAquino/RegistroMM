import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';
import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomGridProps extends MuiGridProps {
  item?: boolean;
  container?: boolean;
  zeroMinWidth?: boolean;
  children?: React.ReactNode;
  xs?: number | boolean | 'auto';
  sm?: number | boolean | 'auto';
  md?: number | boolean | 'auto';
  lg?: number | boolean | 'auto';
  xl?: number | boolean | 'auto';
  spacing?: number;
  sx?: SxProps<Theme>;
}

export const Grid = React.forwardRef<HTMLDivElement, CustomGridProps>((props, ref) => {
  return <MuiGrid ref={ref} {...props} />;
});

Grid.displayName = 'CustomGrid';
