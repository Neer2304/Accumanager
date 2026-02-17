// components/googleadminads/GoogleAdminAdsTable.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  Stack,
  Badge,
  alpha,
} from '@mui/material'
import {
  Campaign,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Campaign as CampaignType } from './types'

interface GoogleAdminAdsTableProps {
  campaigns: CampaignType[]
  onEdit: (campaign: CampaignType) => void
  onDelete: (id: number) => void
  darkMode?: boolean
}

export default function GoogleAdminAdsTable({ 
  campaigns, 
  onEdit, 
  onDelete,
  darkMode 
}: GoogleAdminAdsTableProps) {
  
  const activeCount = campaigns.filter(c => c.status === 'active').length

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
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          pb: 2, 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
        }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Campaign sx={{ 
                color: darkMode ? '#8ab4f8' : '#1a73e8',
                fontSize: { xs: 24, sm: 28 },
              }} />
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  Active Campaigns
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    mt: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}
                >
                  {campaigns.length} campaigns running
                </Typography>
              </Box>
            </Box>
            <Badge 
              badgeContent={activeCount} 
              color="primary" 
              showZero
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#1a73e8',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                }}
              >
                Active Campaigns
              </Typography>
            </Badge>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                {[
                  'Campaign Name', 'Status', 'Impressions', 
                  'Clicks', 'CTR', 'Revenue', 'Actions'
                ].map((header) => (
                  <TableCell 
                    key={header}
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontWeight: 600,
                      borderBottom: 'none',
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      py: { xs: 1.5, sm: 2 },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  hover
                  sx={{
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    '&:hover': { 
                      backgroundColor: darkMode ? '#2d2f31' : '#f1f3f4',
                    },
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Box>
                      <Typography 
                        fontWeight="500" 
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        }}
                      >
                        {campaign.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        {campaign.placement}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Chip
                      label={campaign.status}
                      size="small"
                      sx={{
                        bgcolor: campaign.status === 'active' 
                          ? alpha('#34a853', 0.1)
                          : alpha('#fbbc04', 0.1),
                        color: campaign.status === 'active' 
                          ? '#34a853'
                          : '#fbbc04',
                        fontWeight: 500,
                        border: 'none',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        textTransform: 'capitalize',
                        height: { xs: 24, sm: 28 },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Typography 
                      sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    >
                      {campaign.impressions.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Typography 
                      sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    >
                      {campaign.clicks.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Typography 
                      sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    >
                      {campaign.ctr}%
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Typography 
                      fontWeight="bold" 
                      sx={{ 
                        color: '#34a853',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    >
                      ₹{campaign.revenue.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    py: { xs: 1.5, sm: 2 },
                  }}>
                    <Box display="flex" gap={1}>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(campaign)}
                        sx={{
                          color: '#fbbc04',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          borderRadius: '8px',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          py: { xs: 0.5, sm: 0.75 },
                          '&:hover': {
                            backgroundColor: alpha('#fbbc04', 0.1),
                            borderColor: '#fbbc04',
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete(campaign.id)}
                        sx={{
                          color: '#ea4335',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          borderRadius: '8px',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          py: { xs: 0.5, sm: 0.75 },
                          '&:hover': {
                            backgroundColor: alpha('#ea4335', 0.1),
                            borderColor: '#ea4335',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}