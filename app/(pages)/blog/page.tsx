// app/blog/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  useTheme,
  alpha,
  Grid,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Search,
  CalendarToday,
  AccessTime,
  Person,
  ArrowForward,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'

interface BlogAuthor {
  name: string
  avatar?: string
  role: string
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  author: BlogAuthor
  category: string
  tags: string[]
  coverImage?: string
  readTime: number
  publishedAt: string
  featured: boolean
}

interface BlogCategory {
  id: string
  name: string
  count: number
}

export default function BlogPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const POSTS_PER_PAGE = 6

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [page, selectedCategory, searchQuery])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: POSTS_PER_PAGE.toString(),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/blog/posts?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)
      
      setPosts(data.posts)
      setTotalPages(data.totalPages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)
      
      setCategories(data.categories)
    } catch (err: any) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)

  if (loading && posts.length === 0) {
    return (
      <MainLayout title="Blog">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Blog">
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              AccuManage Blog
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Insights, updates, and stories from the AccuManage team
            </Typography>

            {/* Search */}
            <Paper 
              elevation={0}
              sx={{ 
                maxWidth: 500, 
                mx: 'auto',
                mb: 3,
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '12px',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                }}
              />
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Categories */}
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              flexWrap="wrap"
              sx={{ gap: 1 }}
            >
              <Chip
                label="All Posts"
                onClick={() => handleCategoryChange('all')}
                sx={{
                  backgroundColor: selectedCategory === 'all' 
                    ? '#4285f4' 
                    : darkMode ? '#303134' : '#ffffff',
                  color: selectedCategory === 'all' 
                    ? '#ffffff' 
                    : darkMode ? '#e8eaed' : '#202124',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  '&:hover': {
                    backgroundColor: selectedCategory === 'all' 
                      ? '#4285f4' 
                      : darkMode ? '#3c4043' : '#f1f3f4',
                  },
                }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.name} (${category.count})`}
                  onClick={() => handleCategoryChange(category.id)}
                  sx={{
                    backgroundColor: selectedCategory === category.id 
                      ? '#4285f4' 
                      : darkMode ? '#303134' : '#ffffff',
                    color: selectedCategory === category.id 
                      ? '#ffffff' 
                      : darkMode ? '#e8eaed' : '#202124',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    '&:hover': {
                      backgroundColor: selectedCategory === category.id 
                        ? '#4285f4' 
                        : darkMode ? '#3c4043' : '#f1f3f4',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
                Featured Posts
              </Typography>
              <Grid container spacing={3}>
                {featuredPosts.slice(0, 2).map((post) => (
                  <Grid item xs={12} md={6} key={post.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: '16px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        transition: 'all 0.2s',
                        height: '100%',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => window.location.href = `/blog/${post.slug}`}
                    >
                      {post.coverImage && (
                        <Box
                          sx={{
                            height: 200,
                            backgroundImage: `url(${post.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      )}
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={post.category}
                            size="small"
                            sx={{
                              backgroundColor: alpha('#4285f4', 0.1),
                              color: '#4285f4',
                            }}
                          />
                        </Box>

                        <Typography variant="h5" fontWeight={500} gutterBottom>
                          {post.title}
                        </Typography>

                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
                          {post.excerpt}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#4285f4' }}>
                            {post.author.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {post.author.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {post.author.role}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="caption">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 16, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            <Typography variant="caption">{post.readTime} min read</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Regular Posts */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
              Latest Articles
            </Typography>
            <Grid container spacing={3}>
              {regularPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: '16px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      transition: 'all 0.2s',
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      }
                    }}
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={post.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#4285f4', 0.1),
                            color: '#4285f4',
                          }}
                        />
                      </Box>

                      <Typography variant="h6" fontWeight={500} gutterBottom>
                        {post.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
                        {post.excerpt}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem', bgcolor: '#4285f4' }}>
                          {post.author.name.charAt(0)}
                        </Avatar>
                        <Typography variant="caption">
                          {post.author.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                          <Typography variant="caption">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          endIcon={<ArrowForward />}
                          sx={{ 
                            color: '#4285f4',
                            fontSize: '0.75rem',
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Container>
      </Box>
    </MainLayout>
  )
}