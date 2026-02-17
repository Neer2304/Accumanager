// components/googleadminsupport/GoogleSupportDialog.tsx
'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Paper,
  Box,
  Avatar,
  Button,
  TextareaAutosize,
  alpha,
} from '@mui/material'
import {
  Person,
  AccessTime,
  Email as EmailIcon,
} from '@mui/icons-material'
import { SupportDialogProps } from './types'

export default function GoogleSupportDialog({
  open,
  ticket,
  replyMessage,
  onReplyChange,
  onSendReply,
  onUpdateStatus,
  onClose,
  darkMode,
  getPriorityColor,
  getStatusColor,
}: SupportDialogProps) {
  if (!ticket) return null

  const handleStatusChange = (status: string) => {
    onUpdateStatus(ticket._id, status)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#e8eaed' : '#202124',
        fontWeight: 500,
        pb: 2,
        px: { xs: 2, sm: 3 },
      }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Support Ticket #{ticket._id.substring(0, 8)}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
            <Chip
              label={`Priority: ${ticket.priority}`}
              size="small"
              sx={{
                bgcolor: alpha(getPriorityColor(ticket.priority), 0.1),
                color: getPriorityColor(ticket.priority),
                fontWeight: 600,
                border: 'none',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            />
            <Chip
              label={`Status: ${ticket.status.replace("-", " ")}`}
              size="small"
              sx={{
                bgcolor: alpha(getStatusColor(ticket.status), 0.1),
                color: getStatusColor(ticket.status),
                fontWeight: 500,
                border: 'none',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            />
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* User Info */}
          <Card sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.1),
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                }}>
                  <Person fontSize="medium" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                    {ticket.userName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {ticket.userEmail}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      display: "flex", 
                      alignItems: "center", 
                      gap: 0.5, 
                      mt: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    <AccessTime fontSize="small" />
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Ticket Content */}
          <Card sx={{
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            boxShadow: 'none',
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: darkMode ? '#8ab4f8' : '#1a73e8',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                }}
              >
                {ticket.subject}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }} 
                paragraph
              >
                {ticket.message}
              </Typography>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Paper sx={{ 
            p: 2,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Update Status:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {["in-progress", "resolved", "closed"].map(
                (status) =>
                  ticket.status !== status && (
                    <Button
                      key={status}
                      size="small"
                      variant="outlined"
                      onClick={() => handleStatusChange(status)}
                      sx={{ 
                        textTransform: "capitalize",
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderColor: darkMode ? '#5f6368' : '#dadce0',
                        borderRadius: '8px',
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        '&:hover': {
                          backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
                          borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                        },
                      }}
                    >
                      Mark as {status.replace("-", " ")}
                    </Button>
                  ),
              )}
            </Stack>
          </Paper>

          {/* Conversation */}
          {ticket.replies.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Conversation ({ticket.replies.length} replies):
              </Typography>
              <Stack spacing={2}>
                {ticket.replies.map((reply: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: reply.isAdmin 
                        ? (darkMode ? alpha('#8ab4f8', 0.1) : alpha('#1a73e8', 0.08)) 
                        : (darkMode ? alpha('#9aa0a6', 0.1) : alpha('#5f6368', 0.08)),
                      borderLeft: `4px solid ${reply.isAdmin 
                        ? (darkMode ? '#8ab4f8' : '#1a73e8') 
                        : (darkMode ? '#9aa0a6' : '#5f6368')}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {reply.isAdmin ? "📌 Admin" : "👤 User"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mt: 1, color: darkMode ? '#e8eaed' : '#202124' }}>
                      {reply.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Reply Box */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Send Reply:
            </Typography>
            <TextareaAutosize
              minRows={4}
              value={replyMessage}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Type your response to the user here..."
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                fontFamily: "inherit",
                fontSize: "14px",
                color: darkMode ? '#e8eaed' : '#202124',
                marginBottom: "12px",
                resize: "vertical",
                transition: "border 0.2s",
              }}
            />
            <Button
              variant="contained"
              onClick={onSendReply}
              disabled={!replyMessage.trim()}
              startIcon={<EmailIcon />}
              sx={{
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1669c1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(26, 115, 232, 0.2)',
                },
                borderRadius: '12px',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
              fullWidth
            >
              Send Reply to User
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <Button 
          onClick={onClose}
          sx={{
            color: darkMode ? '#9aa0a6' : '#5f6368',
            '&:hover': {
              backgroundColor: darkMode ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
            },
            borderRadius: '8px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}