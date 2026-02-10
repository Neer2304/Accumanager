import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export const TextField: React.FC<MuiTextFieldProps> = (props) => {
  return <MuiTextField {...props} />;
};