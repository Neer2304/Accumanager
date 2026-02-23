// components/blog/BlogSearch.tsx
import {
  Paper,
  InputBase,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function BlogSearch({ value, onChange, onSearch }: BlogSearchProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '24px',
        '&:hover': {
          borderColor: darkMode ? '#5f6368' : '#bdc1c6'
        }
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Search articles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton 
        type="submit" 
        sx={{ 
          p: '10px',
          color: darkMode ? '#8ab4f8' : '#4285f4'
        }}
      >
        <Search />
      </IconButton>
    </Paper>
  );
}