import React, { ReactNode } from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { Box } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  ...buttonProps
}) => {
  return (
    <MuiButton {...buttonProps}>
      {children}
    </MuiButton>
  );
};