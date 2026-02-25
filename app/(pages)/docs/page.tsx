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
  TextField,
  InputAdornment,
  Chip,
  Button,
  useTheme,
  alpha,
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

  useEffect(() => {
    fetchDocumentation()
  }, [])

  const fetchDocumentation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/docs')
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)
      
      setCategories(data.categories || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter categories based on search
  const filteredCategories = categories
    .map(category => ({
      ...category,
      articles: category.articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.articles.length > 0)

  // Get all articles for "All Categories" view
  const allArticles = categories.flatMap(category => 
    category.articles.map(article => ({
      ...article,
      categoryTitle: category.title,
      categoryIcon: category.icon,
    }))
  )

  if (loading) {
    return (
      <MainLayout title="Documentation">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
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
        py: { xs: 2, sm: 3, md: 4 },
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography 
              variant="h2" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Documentation
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                px: 2,
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
              <Box sx={{ mt: 2 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            )}
          </Box>

          {/* Documentation Layout - Flexbox instead of Grid */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}>
            {/* Sidebar */}
            <Box sx={{ 
              width: { xs: '100%', md: 280 },
              flexShrink: 0,
            }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  position: { md: 'sticky' },
                  top: { md: 80 },
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600} 
                  sx={{ 
                    px: 1, 
                    mb: 1,
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: '0.9rem',
                  }}
                >
                  Categories
                </Typography>
                <List component="nav" dense>
                  {/* Fix: Use button={true} as a boolean prop */}
                  <ListItem 
                    button={true}
                    selected={selectedCategory === null}
                    onClick={() => setSelectedCategory(null)}
                    sx={{
                      borderRadius: '8px',
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha('#4285f4', 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                      <MenuBook sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="All Categories"
                      secondary={`${allArticles.length} articles`}
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        fontWeight: selectedCategory === null ? 500 : 400,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.75rem',
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                      }}
                    />
                  </ListItem>

                  {categories.map((category) => (
                    // Fix: Use button={true} as a boolean prop
                    <ListItem 
                      key={category.id}
                      button={true}
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
                        {category.icon === 'api' ? <Api sx={{ fontSize: 20 }} /> : 
                         category.icon === 'getting-started' ? <PlayArrow sx={{ fontSize: 20 }} /> : 
                         category.icon === 'guides' ? <MenuBook sx={{ fontSize: 20 }} /> : 
                         <Description sx={{ fontSize: 20 }} />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.title}
                        secondary={`${category.articles.length} articles`}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: selectedCategory === category.id ? 500 : 400,
                          color: darkMode ? '#e8eaed' : '#202124',
                        }}
                        secondaryTypographyProps={{ 
                          fontSize: '0.75rem',
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack spacing={3}>
                {/* Show selected category or all categories */}
                {selectedCategory ? (
                  // Single Category View
                  categories
                    .filter(cat => cat.id === selectedCategory)
                    .map(category => (
                      <Paper 
                        key={category.id}
                        elevation={0}
                        sx={{ 
                          p: { xs: 2, sm: 3 },
                          borderRadius: '12px',
                          backgroundColor: darkMode ? '#303134' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                          <Box sx={{ 
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                            display: 'flex',
                          }}>
                            {category.icon === 'api' ? <Api /> : 
                             category.icon === 'getting-started' ? <PlayArrow /> : 
                             category.icon === 'guides' ? <MenuBook /> : 
                             <Description />}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                              {category.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {category.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                        }}>
                          {(searchQuery ? category.articles.filter(article =>
                            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.description.toLowerCase().includes(searchQuery.toLowerCase())
                          ) : category.articles).map((article) => (
                            <Box 
                              key={article.id}
                              sx={{ 
                                width: { xs: '100%', sm: 'calc(50% - 8px)' },
                              }}
                            >
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
                                  height: '100%',
                                  '&:hover': {
                                    borderColor: '#4285f4',
                                    transform: 'translateY(-2px)',
                                    boxShadow: darkMode 
                                      ? '0 4px 12px rgba(0,0,0,0.5)'
                                      : '0 4px 12px rgba(0,0,0,0.1)',
                                  }
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Description sx={{ fontSize: 20, color: '#4285f4' }} />
                                  <Typography 
                                    variant="subtitle2" 
                                    fontWeight={600} 
                                    sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                                  >
                                    {article.title}
                                  </Typography>
                                </Box>
                                
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: darkMode ? '#9aa0a6' : '#5f6368', 
                                    mb: 2,
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {article.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <Launch sx={{ fontSize: 16, color: '#4285f4' }} />
                                </Box>
                              </Paper>
                            </Box>
                          ))}
                        </Box>

                        {category.articles.length === 0 && (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              No articles found
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))
                ) : (
                  // All Categories View
                  (searchQuery ? filteredCategories : categories).map((category) => (
                    <Paper 
                      key={category.id}
                      elevation={0}
                      sx={{ 
                        p: { xs: 2, sm: 3 },
                        borderRadius: '12px',
                        backgroundColor: darkMode ? '#303134' : '#ffffff',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{ 
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          display: 'flex',
                        }}>
                          {category.icon === 'api' ? <Api /> : 
                           category.icon === 'getting-started' ? <PlayArrow /> : 
                           category.icon === 'guides' ? <MenuBook /> : 
                           <Description />}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {category.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {category.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}>
                        {category.articles.map((article) => (
                          <Box 
                            key={article.id}
                            sx={{ 
                              width: { xs: '100%', sm: 'calc(50% - 8px)' },
                            }}
                          >
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
                                height: '100%',
                                '&:hover': {
                                  borderColor: '#4285f4',
                                  transform: 'translateY(-2px)',
                                  boxShadow: darkMode 
                                    ? '0 4px 12px rgba(0,0,0,0.5)'
                                    : '0 4px 12px rgba(0,0,0,0.1)',
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Description sx={{ fontSize: 20, color: '#4285f4' }} />
                                <Typography 
                                  variant="subtitle2" 
                                  fontWeight={600} 
                                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                                >
                                  {article.title}
                                </Typography>
                              </Box>
                              
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: darkMode ? '#9aa0a6' : '#5f6368', 
                                  mb: 2,
                                  fontSize: '0.875rem',
                                  lineHeight: 1.5,
                                }}
                              >
                                {article.description}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Launch sx={{ fontSize: 16, color: '#4285f4' }} />
                              </Box>
                            </Paper>
                          </Box>
                        ))}
                      </Box>

                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Button 
                          endIcon={<ChevronRight />}
                          component="a"
                          href={`/docs/category/${category.id}`}
                          sx={{ 
                            color: '#4285f4',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'transparent',
                              textDecoration: 'underline',
                            }
                          }}
                        >
                          View All {category.title}
                        </Button>
                      </Box>
                    </Paper>
                  ))
                )}

                {/* No Results */}
                {searchQuery && filteredCategories.length === 0 && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 4, sm: 6 }, 
                      textAlign: 'center',
                      borderRadius: '12px',
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}
                  >
                    <Search sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2 }} />
                    <Typography variant="h6" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      No results found
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Try searching with different keywords
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  )
}