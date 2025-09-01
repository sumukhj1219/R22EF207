import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { Box } from '@mui/material';



export interface InputProps extends MuiTextFieldProps {}

export const Input: React.FC<InputProps> = (props) => {
  return <MuiTextField {...props} />;
};