// components/blog/BlogHeader.tsx
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';

interface BlogHeaderProps {
  title: string;
  subtitle: string;
}

export default function BlogHeader({ title, subtitle }: BlogHeaderProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography 
        variant="h2" 
        fontWeight="bold" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          background: 'linear-gradient(45deg, #4285f4, #34a853)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
        {subtitle}
      </Typography>
    </Box>
  );
}