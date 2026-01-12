import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import {
  Search,
  Clear,
} from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  debounceTime?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  debounceTime = 300,
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceTime);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        size={size}
        variant={variant}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: localValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};