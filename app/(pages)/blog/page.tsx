// app/blog/page.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useMediaQuery,
  useTheme,
  alpha,
  Breadcrumbs,
  Avatar,
  Divider,
  Paper,
  IconButton,
  InputBase,
  Pagination,
  Skeleton,
  Snackbar,
} from '@mui/material';
import {
  Search,
  Home as HomeIcon,
  Schedule,
  Visibility,
  Person,
  Category as CategoryIcon,
  ArrowForward,
  LocalFireDepartment,
  TrendingUp,
  GridView,
  ViewList,
  Close,
  BookmarkBorder,
  Bookmark,
  AutoAwesome,
  MenuBook,
  LibraryBooks,
  Code,
  Business,
  Speed,
  Psychology,
  NewReleases,
  Whatshot,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

// Google colors matching inventory page
const google = {
  blue: '#4285f4',
  blueLight: '#e8f0fe',
  blueDark: '#3367d6',
  green: '#34a853',
  greenLight: '#e6f4ea',
  yellow: '#fbbc04',
  yellowLight: '#fef7e0',
  red: '#ea4335',
  redLight: '#fce8e6',
  grey: '#5f6368',
  greyLight: '#f8f9fa',
  greyBorder: '#dadce0',
  greyDark: '#3c4043',
  white: '#ffffff',
  black: '#202124',
};

// Category icons mapping
const categoryIcons: Record<string, JSX.Element> = {
  'development': <Code sx={{ fontSize: 18 }} />,
  'business': <Business sx={{ fontSize: 18 }} />,
  'productivity': <Speed sx={{ fontSize: 18 }} />,
  'psychology': <Psychology sx={{ fontSize: 18 }} />,
  'tutorial': <MenuBook sx={{ fontSize: 18 }} />,
  'news': <NewReleases sx={{ fontSize: 18 }} />,
  'technology': <AutoAwesome sx={{ fontSize: 18 }} />,
  'design': <AutoAwesome sx={{ fontSize: 18 }} />,
  'marketing': <TrendingUp sx={{ fontSize: 18 }} />,
};

// Blog icon component
const BlogIcon = ({ name, size = 'medium', color }: { name: string; size?: 'small' | 'medium' | 'large'; color?: string }) => {
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  
  const icons: Record<string, JSX.Element> = {
    'Blog': <MenuBook sx={{ fontSize: iconSize, color }} />,
    'Search': <Search sx={{ fontSize: iconSize, color }} />,
    'Filter': <CategoryIcon sx={{ fontSize: iconSize, color }} />,
    'Refresh': <AutoAwesome sx={{ fontSize: iconSize, color }} />,
    'Grid': <GridView sx={{ fontSize: iconSize, color }} />,
    'List': <ViewList sx={{ fontSize: iconSize, color }} />,
    'Bookmark': <BookmarkBorder sx={{ fontSize: iconSize, color }} />,
    'BookmarkFilled': <Bookmark sx={{ fontSize: iconSize, color }} />,
    'Close': <Close sx={{ fontSize: iconSize, color }} />,
    'ArrowForward': <ArrowForward sx={{ fontSize: iconSize, color }} />,
  };
  
  return icons[name] || <MenuBook sx={{ fontSize: iconSize, color }} />;
};

// Blog post card component
function BlogPostCard({ post, viewMode, darkMode, onBookmark }: { 
  post: any; 
  viewMode: 'grid' | 'list'; 
  darkMode: boolean;
  onBookmark: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark(post.id);
  };

  if (viewMode === 'grid') {
    return (
      <Card
        hover
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          backgroundColor: darkMode ? google.greyDark : google.white,
          border: `1px solid ${darkMode ? alpha(google.greyBorder, 0.2) : google.greyBorder}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: darkMode 
              ? '0 8px 16px rgba(0,0,0,0.5)' 
              : '0 8px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        {/* Bookmark button */}
        <IconButton
          onClick={handleBookmark}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: alpha(google.white, 0.9),
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: google.white,
            },
            width: 32,
            height: 32,
          }}
          size="small"
        >
          {isBookmarked ? 
            <Bookmark sx={{ color: google.blue, fontSize: 18 }} /> : 
            <BookmarkBorder sx={{ color: google.grey, fontSize: 18 }} />
          }
        </IconButton>

        {/* Featured badge */}
        {post.featured && (
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 14 }} />}
            label="Featured"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              backgroundColor: google.yellow,
              color: google.black,
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-icon': { color: google.black, fontSize: 14 }
            }}
          />
        )}

        {/* Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          <img
            src={post.coverImage || '/images/blog-placeholder.jpg'}
            alt={post.title}
            style={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              transition: 'transform 0.3s',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Chip
              icon={categoryIcons[post.category?.slug] || <LibraryBooks sx={{ fontSize: 14 }} />}
              label={post.category?.name}
              size="small"
              sx={{
                backgroundColor: alpha(google.blue, 0.1),
                color: google.blue,
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-icon': { color: google.blue, fontSize: 14 }
              }}
            />
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1,
              fontSize: '1rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8em',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            {post.title}
          </Typography>

          {/* Excerpt */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              mb: 2,
              fontSize: '0.875rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '4.2em',
              flex: 1,
            }}
          >
            {post.excerpt}
          </Typography>

          {/* Author and metadata */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            mt: 'auto',
            pt: 1.5,
            borderTop: `1px solid ${darkMode ? alpha(google.greyBorder, 0.2) : google.greyBorder}`,
          }}>
            <Avatar 
              src={post.author?.avatar} 
              sx={{ 
                width: 28, 
                height: 28,
                bgcolor: google.blue,
                fontSize: '0.75rem',
              }}
            >
              {post.author?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={500} display="block" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                {post.author?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <Schedule sx={{ fontSize: 12, color: google.grey }} />
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <AccessTime sx={{ fontSize: 12, color: google.grey }} />
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {post.readTime} min
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Read more link */}
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', marginTop: 12 }}>
            <Button
              variant="text"
              size="small"
              iconRight={<ArrowForward sx={{ fontSize: 16 }} />}
              sx={{
                color: google.blue,
                p: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                }
              }}
            >
              Read Article
            </Button>
          </Link>
        </Box>
      </Card>
    );
  }

  // List View
  return (
    <Card
      hover
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        backgroundColor: darkMode ? google.greyDark : google.white,
        border: `1px solid ${darkMode ? alpha(google.greyBorder, 0.2) : google.greyBorder}`,
        overflow: 'hidden',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: darkMode 
            ? '0 4px 12px rgba(0,0,0,0.5)' 
            : '0 4px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Image section */}
      <Box sx={{ 
        position: 'relative', 
        width: { xs: '100%', sm: 200 },
        flexShrink: 0
      }}>
        <img
          src={post.coverImage || '/images/blog-placeholder.jpg'}
          alt={post.title}
          style={{
            width: '100%',
            // height: { xs: 150, sm: '100%' },
            objectFit: 'cover',
          }}
        />
        {post.featured && (
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 12 }} />}
            label="Featured"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: google.yellow,
              color: google.black,
              fontWeight: 500,
              fontSize: '0.65rem',
              height: 20,
            }}
          />
        )}
        <IconButton
          onClick={handleBookmark}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: alpha(google.white, 0.9),
            backdropFilter: 'blur(4px)',
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: google.white,
            }
          }}
          size="small"
        >
          {isBookmarked ? 
            <Bookmark sx={{ color: google.blue, fontSize: 16 }} /> : 
            <BookmarkBorder sx={{ color: google.grey, fontSize: 16 }} />
          }
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={categoryIcons[post.category?.slug] || <LibraryBooks sx={{ fontSize: 14 }} />}
            label={post.category?.name}
            size="small"
            sx={{
              backgroundColor: alpha(google.blue, 0.1),
              color: google.blue,
              fontWeight: 500,
              height: 24,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Visibility sx={{ fontSize: 14, color: google.grey }} />
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {post.views?.toLocaleString()} views
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: '1.1rem',
            color: darkMode ? '#e8eaed' : '#202124',
          }}
        >
          {post.title}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            mb: 2,
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          {post.excerpt}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
          mb: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={post.author?.avatar} sx={{ width: 24, height: 24 }}>
              {post.author?.name?.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              {post.author?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 14, color: google.blue }} />
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 14, color: google.green }} />
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              {post.readTime} min read
            </Typography>
          </Box>
        </Box>

        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            size="small"
            iconRight={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: darkMode ? google.greyDark : google.greyBorder,
              color: darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                borderColor: google.blue,
                backgroundColor: alpha(google.blue, 0.04),
              }
            }}
          >
            Read Full Article
          </Button>
        </Link>
      </Box>
    </Card>
  );
}

// Main content component
function BlogContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const darkMode = theme.palette.mode === 'dark';
  
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [pagination.page, filterCategory, searchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/category');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy
      });
      
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (error) {
      setError('Failed to load blog posts');
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchPosts();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setPagination({ ...pagination, page: 1 });
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    setSnackbar({ 
      open: true, 
      message: bookmarkedPosts.includes(postId) ? 'Removed from bookmarks' : 'Added to bookmarks', 
      severity: 'success' 
    });
  };

  const handleRefresh = () => {
    fetchPosts();
    setSnackbar({ open: true, message: 'Posts refreshed', severity: 'success' });
  };

  const categories_list = Array.from(new Set(posts.map(p => p.category?.slug))).filter(Boolean);

  // Filter posts client-side for instant UI updates
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || post.category?.slug === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading && posts.length === 0) {
    return (
      <MainLayout title="Blog - AccuManage">
        <LoadingState />
      </MainLayout>
    );
  }

  if (error && !loading && posts.length === 0) {
    return (
      <MainLayout title="Blog - AccuManage">
        <ErrorState 
          error={error} 
          onRetry={fetchPosts}
          retryText="Retry"
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Blog - AccuManage">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2, md: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #1a237e 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              Blog
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: darkMode ? '#e8eaed' : '#202124',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <BlogIcon name="Blog" size="large" color={google.blue} />
              AccuManage Blog
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
              }}
            >
              Insights, tutorials, and updates to help you manage your business better
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 3,
              alignItems: 'center',
            }}>
              <Chip
                label={`${pagination.total || 0} Articles`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha(google.blue, 0.1) : alpha(google.blue, 0.08),
                  borderColor: alpha(google.blue, 0.3),
                  color: darkMode ? '#8ab4f8' : google.blue,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
              <Chip
                label={`${categories.length} Categories`}
                variant="outlined"
                sx={{
                  backgroundColor: darkMode ? alpha(google.green, 0.1) : alpha(google.green, 0.08),
                  borderColor: alpha(google.green, 0.3),
                  color: darkMode ? '#81c995' : google.green,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              />
              {filteredPosts.filter(p => p.featured).length > 0 && (
                <Chip
                  icon={<AutoAwesome sx={{ fontSize: 14 }} />}
                  label={`${filteredPosts.filter(p => p.featured).length} Featured`}
                  variant="outlined"
                  sx={{
                    backgroundColor: darkMode ? alpha(google.yellow, 0.1) : alpha(google.yellow, 0.08),
                    borderColor: alpha(google.yellow, 0.3),
                    color: darkMode ? '#fdd663' : google.yellow,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              title="Error Loading Posts"
              message={typeof error === 'string' ? error : 'An error occurred'}
              dismissible
              onDismiss={() => setError(null)}
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                borderRadius: 2,
                backgroundColor: darkMode ? alpha(google.red, 0.1) : alpha(google.red, 0.05),
                border: `1px solid ${darkMode ? alpha(google.red, 0.3) : alpha(google.red, 0.2)}`,
                color: darkMode ? '#f28b82' : google.red,
              }}
            />
          )}

          {/* Header Controls */}
          <Card
            title="Blog Posts"
            subtitle={`${filteredPosts.length} articles • ${pagination.total || 0} total in blog`}
            action={
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {}}
                  iconLeft={<BlogIcon name="Filter" size="medium" />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  iconLeft={<BlogIcon name="Refresh" size="medium" />}
                  size="medium"
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                    '&:hover': {
                      borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                      backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                    }
                  }}
                >
                  Refresh
                </Button>
                <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    sx={{
                      backgroundColor: viewMode === 'grid' ? alpha(google.blue, 0.1) : 'transparent',
                      color: viewMode === 'grid' ? google.blue : darkMode ? '#9aa0a6' : '#5f6368',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: viewMode === 'grid' ? alpha(google.blue, 0.15) : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    <GridView sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    sx={{
                      backgroundColor: viewMode === 'list' ? alpha(google.blue, 0.1) : 'transparent',
                      color: viewMode === 'list' ? google.blue : darkMode ? '#9aa0a6' : '#5f6368',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: viewMode === 'list' ? alpha(google.blue, 0.15) : darkMode ? '#3c4043' : '#f8f9fa',
                      }
                    }}
                  >
                    <ViewList sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              mt: 2,
            }}>
              <TextField
                fullWidth
                placeholder="Search articles by title, content, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BlogIcon name="Search" size="medium" color={darkMode ? '#9aa0a6' : '#5f6368'} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <Close sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#e8eaed' : '#202124',
                  }
                }}
                size={isMobile ? "small" : "medium"}
              />
              
              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: 2,
                }
              }} size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Category
                </InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.slug}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: google.blue 
                        }} />
                        {category.name} ({category.count})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ 
                minWidth: { xs: '100%', sm: 150 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                  borderRadius: 2,
                }
              }} size={isMobile ? "small" : "medium"}>
                <InputLabel sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Sort By
                </InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="latest">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule sx={{ fontSize: 18 }} />
                      Latest
                    </Box>
                  </MenuItem>
                  <MenuItem value="popular">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalFireDepartment sx={{ fontSize: 18 }} />
                      Most Popular
                    </Box>
                  </MenuItem>
                  <MenuItem value="trending">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 18 }} />
                      Trending
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Active filters */}
            {(searchTerm || filterCategory !== 'all') && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', alignSelf: 'center' }}>
                  Active filters:
                </Typography>
                {filterCategory !== 'all' && (
                  <Chip
                    label={`Category: ${categories.find(c => c.slug === filterCategory)?.name || filterCategory}`}
                    size="small"
                    onDelete={() => setFilterCategory('all')}
                    sx={{ 
                      borderRadius: '16px',
                      backgroundColor: darkMode ? alpha(google.blue, 0.1) : alpha(google.blue, 0.08),
                    }}
                  />
                )}
                {searchTerm && (
                  <Chip
                    label={`Search: ${searchTerm}`}
                    size="small"
                    onDelete={() => setSearchTerm('')}
                    sx={{ 
                      borderRadius: '16px',
                      backgroundColor: darkMode ? alpha(google.blue, 0.1) : alpha(google.blue, 0.08),
                    }}
                  />
                )}
              </Box>
            )}
          </Card>

          {/* Category Pills */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Popular Topics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setFilterCategory('all')}
                sx={{
                  backgroundColor: filterCategory === 'all' ? google.blue : 'transparent',
                  color: filterCategory === 'all' ? '#ffffff' : darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${filterCategory === 'all' ? google.blue : darkMode ? '#3c4043' : '#dadce0'}`,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: filterCategory === 'all' ? google.blueDark : alpha(google.blue, 0.1),
                  }
                }}
              />
              {categories.slice(0, 6).map((cat) => (
                <Chip
                  key={cat.id}
                  icon={categoryIcons[cat.slug] || <LibraryBooks />}
                  label={cat.name}
                  onClick={() => setFilterCategory(cat.slug)}
                  sx={{
                    backgroundColor: filterCategory === cat.slug ? google.blue : 'transparent',
                    color: filterCategory === cat.slug ? '#ffffff' : darkMode ? '#e8eaed' : '#202124',
                    border: `1px solid ${filterCategory === cat.slug ? google.blue : darkMode ? '#3c4043' : '#dadce0'}`,
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: filterCategory === cat.slug ? '#ffffff' : google.blue
                    },
                    '&:hover': {
                      backgroundColor: filterCategory === cat.slug ? google.blueDark : alpha(google.blue, 0.1),
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Posts Count */}
          {!loading && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Showing {filteredPosts.length} of {pagination.total} articles
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                Sorted by: {sortBy === 'latest' ? 'Latest' : sortBy === 'popular' ? 'Most Popular' : 'Trending'}
              </Typography>
            </Box>
          )}

          {/* Blog Posts Grid/List */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mx: -1.5
          }}>
            {loading ? (
              // Loading Skeletons
              [...Array(6)].map((_, i) => (
                <Box key={i} sx={{ 
                  width: viewMode === 'grid' 
                    ? { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }
                    : '100%',
                  mx: 1.5
                }}>
                  <Card sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }}>
                    <Skeleton variant="rectangular" height={viewMode === 'grid' ? 180 : 200} animation="wave" />
                    <Box sx={{ p: 2 }}>
                      <Skeleton width="60%" animation="wave" />
                      <Skeleton width="40%" animation="wave" />
                      <Skeleton width="80%" animation="wave" />
                      <Skeleton width="100%" animation="wave" />
                    </Box>
                  </Card>
                </Box>
              ))
            ) : filteredPosts.length === 0 ? (
              // Empty state
              <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
                <Box sx={{ mb: 3 }}>
                  <MenuBook sx={{ fontSize: 64, color: alpha(google.blue, 0.3) }} />
                </Box>
                <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}>
                  No articles found
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3 }}>
                  Try adjusting your search or filter to find what you're looking for
                </Typography>
                <Button
                  variant="contained"
                  onClick={clearSearch}
                  sx={{
                    backgroundColor: google.blue,
                    '&:hover': {
                      backgroundColor: google.blueDark,
                    }
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            ) : (
              filteredPosts.map((post, index) => (
                <Box key={post.id} sx={{ 
                  width: viewMode === 'grid' 
                    ? { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }
                    : '100%',
                  mx: 1.5
                }}>
                  <BlogPostCard 
                    post={post} 
                    viewMode={viewMode} 
                    darkMode={darkMode}
                    onBookmark={handleBookmark}
                  />
                </Box>
              ))
            )}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(e, page) => setPagination({ ...pagination, page })}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    margin: '0 4px',
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&.Mui-selected': {
                      backgroundColor: google.blue,
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: google.blueDark,
                      }
                    },
                    '&:hover': {
                      backgroundColor: alpha(google.blue, 0.1),
                    }
                  }
                }}
              />
            </Box>
          )}

          {/* Newsletter CTA */}
          <Card
            hover
            sx={{ 
              mt: 6,
              p: { xs: 2, sm: 3 },
              backgroundColor: darkMode ? alpha(google.blue, 0.1) : alpha(google.blue, 0.05),
              border: `1px solid ${darkMode ? alpha(google.blue, 0.3) : alpha(google.blue, 0.2)}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Stay in the loop
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 3, maxWidth: 500, mx: 'auto' }}>
              Get the latest articles, tutorials, and updates delivered straight to your inbox
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', maxWidth: 500, mx: 'auto' }}>
              <TextField
                placeholder="Enter your email"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: google.blue,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: google.blueDark,
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{
            sx: {
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              color: darkMode ? '#e8eaed' : '#202124',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              borderRadius: 2,
            }
          }}
        />
      </Box>
    </MainLayout>
  );
}

export default function BlogPage() {
  return <BlogContent />;
}