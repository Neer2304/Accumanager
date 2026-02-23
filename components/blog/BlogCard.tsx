// components/blog/BlogCard.tsx
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Stack,
  Avatar,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { CalendarToday, Person, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogCardProps {
  post: any;
}

export default function BlogCard({ post }: BlogCardProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: '12px',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
        }
      }}
    >
      {post.coverImage && (
        <CardMedia
          component="img"
          height="200"
          image={post.coverImage}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            label={post.category?.name}
            size="small"
            sx={{
              backgroundColor: alpha('#4285f4', 0.1),
              color: '#4285f4'
            }}
          />
          {post.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                backgroundColor: alpha('#fbbc04', 0.1),
                color: '#fbbc04'
              }}
            />
          )}
        </Box>
        
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.excerpt}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Person fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {post.author?.name}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {post.readTime} min read
        </Typography>
      </CardContent>
      <Button
        component={Link}
        href={`/blog/${post.slug}`}
        sx={{ m: 2, mt: 0 }}
        endIcon={<ArrowForward />}
      >
        Read More
      </Button>
    </Card>
  );
}