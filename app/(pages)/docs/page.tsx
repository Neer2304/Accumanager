// app/docs/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Button,
  useTheme,
  alpha,
  Grid,
  Stack,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Code,
  Api,
  Description,
  MenuBook,
  PlayArrow,
  ChevronRight,
  Launch,
} from '@mui/icons-material'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Alert } from '@/components/ui/Alert'

interface DocArticle {
  id: string
  title: string
  description: string
  slug: string
  category: string
  order: number
  content?: string
}

interface DocCategory {
  id: string
  title: string
  icon: string
  description: string
  articles: DocArticle[]
}

export default function DocumentationPage() {
  const theme = useTheme()
  const darkMode = theme.palette.mode === 'dark'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<DocCategory[]>([])
  const [articles, setArticles] = useState<DocArticle[]>([])

  useEffect(() => {
    fetchDocumentation()
  }, [])

  const fetchDocumentation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/docs')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)
      
      setCategories(data.categories)
      setArticles(data.articles)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0)

  if (loading) {
    return (
      <MainLayout title="Documentation">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Documentation">
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
              Documentation
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
              Learn how to use AccuManage effectively
            </Typography>

            {/* Search */}
            <Paper 
              elevation={0}
              sx={{ 
                maxWidth: 500, 
                mx: 'auto',
                backgroundColor: darkMode ? '#303134' : '#ffffff',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                borderRadius: '12px',
              }}
            >
              <TextField
                fullWidth
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          {/* Documentation Grid */}
          <Grid container spacing={4}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  position: 'sticky',
                  top: 80,
                }}
              >
                <Typography variant="subtitle1" fontWeight={500} sx={{ px: 1, mb: 1 }}>
                  Categories
                </Typography>
                <List component="nav" dense>
                  {categories.map((category) => (
                    <ListItem 
                      key={category.id}
                      button
                      selected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha('#4285f4', 0.1),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                        {category.icon === 'api' ? <Api /> : 
                         category.icon === 'getting-started' ? <PlayArrow /> : 
                         category.icon === 'guides' ? <MenuBook /> : 
                         <Description />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.title}
                        secondary={`${category.articles.length} articles`}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <Stack spacing={4}>
                {(searchQuery ? filteredCategories : categories).map((category) => (
                  <Paper 
                    key={category.id}
                    elevation={0}
                    sx={{ 
                      p: 3,
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                        {category.icon === 'api' ? <Api /> : 
                         category.icon === 'getting-started' ? <PlayArrow /> : 
                         category.icon === 'guides' ? <MenuBook /> : 
                         <Description />}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={500}>
                          {category.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {category.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      {category.articles.map((article) => (
                        <Grid item xs={12} sm={6} key={article.id}>
                          <Paper
                            elevation={0}
                            component="a"
                            href={`/docs/${article.slug}`}
                            sx={{
                              p: 2,
                              display: 'block',
                              textDecoration: 'none',
                              borderRadius: '8px',
                              backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#4285f4',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Description sx={{ fontSize: 20, color: '#4285f4' }} />
                              <Typography variant="subtitle2" fontWeight={500} color={darkMode ? '#e8eaed' : '#202124'}>
                                {article.title}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1.5 }}>
                              {article.description}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Launch sx={{ fontSize: 14, color: '#4285f4' }} />
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Button 
                        endIcon={<ChevronRight />}
                        component="a"
                        href={`/docs/category/${category.id}`}
                        sx={{ 
                          color: '#4285f4',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        View All {category.title}
                      </Button>
                    </Box>
                  </Paper>
                ))}

                {searchQuery && filteredCategories.length === 0 && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 6, 
                      textAlign: 'center',
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Search sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                    <Typography variant="h6" fontWeight={500} gutterBottom>
                      No results found
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Try searching with different keywords
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  )
}