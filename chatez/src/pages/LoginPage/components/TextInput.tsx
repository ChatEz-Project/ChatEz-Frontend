import React from 'react';
import { TextField } from '@mui/material';

interface TextInputProps {
  label: string;
  type?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, type = 'text' }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      type={type}
      fullWidth
      margin="normal"
    />
  );
};

export default TextInput;
