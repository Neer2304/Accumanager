// components/googleadminterms/GoogleTermsList.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  Paper,
  ListItem,
  IconButton,
  Chip,
  CircularProgress,
  Button,
  alpha,
} from '@mui/material'
import {
  History as HistoryIcon,
  Description,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Add as AddIcon,
} from '@mui/icons-material'
import { TermsListProps } from './types'

export default function GoogleTermsList({
  termsHistory,
  loading,
  onEdit,
  onDelete,
  formatDate,
  darkMode,
}: TermsListProps) {
  return (
    <Card sx={{
      borderRadius: '16px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      boxShadow: darkMode 
        ? '0 4px 24px rgba(0, 0, 0, 0.2)'
        : '0 4px 24px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Card Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <HistoryIcon sx={{ 
            fontSize: 24,
            color: darkMode ? '#8ab4f8' : '#1a73e8',
          }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            Terms Version History
          </Typography>
          <Chip 
            label={`${termsHistory.length} versions`}
            size="small"
            sx={{
              ml: 'auto',
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              fontWeight: 500,
              border: 'none',
            }}
          />
        </Box>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            py: 8,
          }}>
            <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Loading terms history...
            </Typography>
          </Box>
        ) : termsHistory.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
          }}>
            <Description sx={{ 
              fontSize: 64, 
              mb: 2,
              color: darkMode ? '#5f6368' : '#9aa0a6',
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: darkMode ? '#e8eaed' : '#202124',
                mb: 1,
              }}
            >
              No Terms & Conditions Found
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                mb: 3,
              }}
            >
              Create your first terms & conditions document
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {termsHistory.map((terms, index) => (
              <Paper
                key={terms._id}
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                    borderColor: darkMode ? '#5f6368' : '#bdc1c6',
                    transform: 'translateX(2px)',
                    boxShadow: darkMode 
                      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(terms._id)}
                        sx={{
                          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                          color: darkMode ? '#fbbc04' : '#f57c00',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.2)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {!terms.isActive && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(terms._id)}
                          sx={{
                            backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                            color: darkMode ? '#ea4335' : '#d32f2f',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.2)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                  sx={{
                    py: 2.5,
                    px: { xs: 2, sm: 3 },
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ 
                    flex: 1,
                    mr: 2,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 1,
                      flexWrap: 'wrap',
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 500,
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                        }}
                      >
                        {terms.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`v${terms.version}`}
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                            color: darkMode ? '#8ab4f8' : '#1a73e8',
                            fontWeight: 600,
                            border: 'none',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                        {terms.isActive && (
                          <Chip 
                            icon={<CheckCircle sx={{ fontSize: 12 }} />}
                            label="Active"
                            size="small"
                            sx={{
                              backgroundColor: darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.1)',
                              color: darkMode ? '#34a853' : '#2e7d32',
                              fontWeight: 600,
                              border: 'none',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Effective:</span> {formatDate(terms.effectiveDate)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Created:</span> {formatDate(terms.createdAt)}
                      </Typography>
                    </Box>
                    
                    {terms.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          mt: 1,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {terms.description}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}