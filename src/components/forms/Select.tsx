import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem, 
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  options: SelectOption[];
  helperText?: string;
  id?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  helperText,
  id,
  required = false,
  error = false,
  disabled = false
}) => {
  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel id={`${id}-label`} required={required}>
        {label}
      </InputLabel>
      <MuiSelect
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
