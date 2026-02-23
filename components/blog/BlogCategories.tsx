// components/blog/BlogCategories.tsx
import {
  Box,
  Chip,
  Typography,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import Link from 'next/link';

interface BlogCategoriesProps {
  categories: any[];
  selectedCategory?: string;
}

export default function BlogCategories({ categories, selectedCategory }: BlogCategoriesProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Categories
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          component={Link}
          href="/blog"
          clickable
          variant={!selectedCategory ? 'filled' : 'outlined'}
          sx={{
            backgroundColor: !selectedCategory 
              ? '#4285f4' 
              : darkMode ? 'transparent' : 'transparent',
            color: !selectedCategory 
              ? 'white' 
              : darkMode ? '#9aa0a6' : '#5f6368',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
            '&:hover': {
              backgroundColor: !selectedCategory 
                ? '#3367d6' 
                : alpha('#4285f4', 0.1)
            }
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={`${category.name} (${category.count})`}
            component={Link}
            href={`/blog/category/${category.slug}`}
            clickable
            variant={selectedCategory === category.slug ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: selectedCategory === category.slug 
                ? '#4285f4' 
                : darkMode ? 'transparent' : 'transparent',
              color: selectedCategory === category.slug 
                ? 'white' 
                : darkMode ? '#9aa0a6' : '#5f6368',
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              '&:hover': {
                backgroundColor: selectedCategory === category.slug 
                  ? '#3367d6' 
                  : alpha('#4285f4', 0.1)
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}