// components/googleadminsupport/GoogleSupportTable.tsx
'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  Button,
  Badge,
  alpha,
} from '@mui/material'
import {
  Person,
  Chat as ChatIcon,
} from '@mui/icons-material'
import { SupportTableProps } from './types'

export default function GoogleSupportTable({
  tickets,
  loading,
  filteredCount,
  totalCount,
  onViewTicket,
  darkMode,
  getPriorityColor,
  getStatusColor,
  formatDate,
}: SupportTableProps) {
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
            <Box>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Support Tickets
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  mt: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {filteredCount} of {totalCount} tickets
              </Typography>
            </Box>
            <Badge 
              badgeContent={tickets.filter(t => t.status === 'open').length} 
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
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                Open Tickets
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
                  'User', 'Subject & Message', 'Priority', 
                  'Status', 'Created', 'Actions'
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        mt: 2,
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    >
                      Loading support tickets...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCount === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <ChatIcon
                      sx={{ 
                        fontSize: { xs: 48, sm: 56 }, 
                        color: darkMode ? '#5f6368' : '#9aa0a6', 
                        mb: 2 
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      No support tickets found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: darkMode ? '#9aa0a6' : '#5f6368',
                        mt: 1,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      }}
                    >
                      {tickets.length > 0 
                        ? "Try changing your search criteria"
                        : "No support requests yet"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow
                    key={ticket._id}
                    hover
                    sx={{
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      '&:hover': { 
                        backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.02),
                        cursor: 'pointer',
                      },
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}
                    onClick={() => onViewTicket(ticket)}
                  >
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{ 
                            bgcolor: alpha(getPriorityColor(ticket.priority), 0.1),
                            color: getPriorityColor(ticket.priority),
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight="bold" 
                            sx={{ 
                              color: darkMode ? '#e8eaed' : '#202124',
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            }}
                          >
                            {ticket.userName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ 
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            }}
                          >
                            {ticket.userEmail}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="500" 
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        }}
                      >
                        {ticket.subject}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          maxWidth: 400,
                        }}
                      >
                        {ticket.message}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Chip
                        label={ticket.priority}
                        size="small"
                        sx={{
                          bgcolor: alpha(getPriorityColor(ticket.priority), 0.1),
                          color: getPriorityColor(ticket.priority),
                          fontWeight: 600,
                          border: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 24, sm: 28 },
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Chip
                        label={ticket.status.replace("-", " ")}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(ticket.status), 0.1),
                          color: getStatusColor(ticket.status),
                          fontWeight: 500,
                          border: 'none',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 24, sm: 28 },
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        {formatDate(ticket.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                      py: { xs: 1.5, sm: 2 },
                    }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ChatIcon fontSize="small" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewTicket(ticket);
                        }}
                        sx={{
                          color: darkMode ? '#8ab4f8' : '#1a73e8',
                          borderColor: darkMode ? '#3c4043' : '#dadce0',
                          borderRadius: '8px',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          py: { xs: 0.5, sm: 0.75 },
                          '&:hover': {
                            backgroundColor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                            borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}