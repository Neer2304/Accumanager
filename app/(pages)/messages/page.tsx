"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Breadcrumbs,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

// Import message components
import { MessageGrid } from '@/components/messages/MessageGrid';
import { MessageSearch } from '@/components/messages/MessageSearch';
import { MessageMenu } from '@/components/messages/MessageMenu';
import { useMessages } from '@/components/messages/useMessages';

interface Message {
  _id: string;
  type: 'meeting_invite' | 'direct_message' | 'system_notification';
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  subject: string;
  content: string;
  meetingId?: string;
  meetingTitle?: string;
  meetingLink?: string;
  meetingTime?: string;
  meetingType?: 'internal' | 'client' | 'partner' | 'team';
  status: 'pending' | 'accepted' | 'declined' | 'read' | 'unread' | 'archived' | 'deleted';
  isStarred: boolean;
  isImportant: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [search, setSearch] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);

  // Using custom hook for messages
  const { 
    messages, 
    loading, 
    deleteMessage, 
    archiveMessage, 
    markAsRead, 
    toggleStar,
    refetch 
  } = useMessages();

  // Filter logic
  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(search.toLowerCase()) ||
      message.content.toLowerCase().includes(search.toLowerCase()) ||
      message.senderName.toLowerCase().includes(search.toLowerCase())
  );

  // Event handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    message: Message
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    const success = await deleteMessage(selectedMessage._id);
    if (success) {
      refetch();
    } else {
      console.error("Failed to delete message");
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    refetch();
  };

  // Stats calculation
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const starredMessages = messages.filter(m => m.isStarred).length;
  const meetingInvites = messages.filter(m => m.type === 'meeting_invite').length;
  const pendingMeetings = messages.filter(m => 
    m.type === 'meeting_invite' && m.status === 'pending'
  ).length;
  const sentMessages = messages.filter(m => m.senderEmail === 'currentuser@example.com').length; // Changed this

  const tabs = [
    { label: 'Inbox', count: messages.filter(m => ['read', 'unread'].includes(m.status)).length },
    { label: 'Unread', count: unreadMessages },
    { label: 'Starred', count: starredMessages },
    { label: 'Meetings', count: meetingInvites },
    { label: 'Sent', count: sentMessages }, // Fixed: Using senderEmail check instead of status
    { label: 'Archived', count: messages.filter(m => m.status === 'archived').length },
  ];

  if (loading) {
    return (
      <MainLayout title="Messages">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          backgroundColor: darkMode ? '#202124' : '#ffffff',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
              Loading messages...
            </Typography>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Messages">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Development Warning - Moved to top */}
        <Alert
          severity="warning"
          title="⚠️ Messaging System Under Development"
          message="This feature is currently in development. Real data integration will be available soon."
          sx={{ 
            mb: 2,
            borderRadius: 2,
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          }}
        />

        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
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
              Messages
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Message Center
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Manage your conversations, meeting invites, and notifications
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${totalMessages} Total Messages`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label={`${unreadMessages} Unread`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.08),
                borderColor: alpha('#ea4335', 0.3),
                color: darkMode ? '#f28b82' : '#ea4335',
              }}
            />
            <Chip
              label={`${meetingInvites} Meetings`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Controls */}
          <Card
            title="Messages"
            subtitle={`${filteredMessages.length} messages • ${unreadMessages} unread`}
            action={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  sx={{
                    borderColor: darkMode ? '#3c4043' : '#dadce0',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setComposeOpen(true)}
                  startIcon={<MailIcon />}
                  sx={{ 
                    backgroundColor: '#34a853',
                    '&:hover': { backgroundColor: '#2d9248' }
                  }}
                >
                  Compose
                </Button>
              </Box>
            }
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            {/* Search and Tabs */}
            <Box sx={{ mt: 2 }}>
              <MessageSearch 
                search={search} 
                onSearchChange={setSearch} 
              />
              
              {/* Tabs */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                mt: 2,
                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                pb: 1,
              }}>
                {tabs.map((tab, index) => (
                  <Button
                    key={tab.label}
                    variant={activeTab === index ? "contained" : "outlined"}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      borderRadius: '20px',
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5,
                      fontSize: '0.75rem',
                      backgroundColor: activeTab === index 
                        ? (darkMode ? '#4285f4' : '#4285f4')
                        : 'transparent',
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: activeTab === index 
                        ? '#ffffff'
                        : (darkMode ? '#e8eaed' : '#202124'),
                      '&:hover': {
                        backgroundColor: activeTab === index 
                          ? (darkMode ? '#3367d6' : '#3367d6')
                          : (darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08)),
                      },
                    }}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <Chip
                        label={tab.count}
                        size="small"
                        sx={{
                          ml: 1,
                          height: '18px',
                          fontSize: '0.6rem',
                          backgroundColor: activeTab === index
                            ? alpha('#ffffff', 0.2)
                            : (darkMode ? '#3c4043' : '#f1f3f4'),
                          color: activeTab === index
                            ? '#ffffff'
                            : (darkMode ? '#e8eaed' : '#202124'),
                        }}
                      />
                    )}
                  </Button>
                ))}
              </Box>
            </Box>
          </Card>

          {/* Stats Overview */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Messages', 
                value: totalMessages, 
                icon: '📧', 
                color: '#4285f4',
                description: 'All messages' 
              },
              { 
                title: 'Unread', 
                value: unreadMessages, 
                icon: '🔴', 
                color: '#ea4335',
                description: 'Require attention' 
              },
              { 
                title: 'Starred', 
                value: starredMessages, 
                icon: '⭐', 
                color: '#fbbc04',
                description: 'Important messages' 
              },
              { 
                title: 'Meeting Invites', 
                value: meetingInvites, 
                icon: '📅', 
                color: '#34a853',
                description: 'Meeting requests' 
              },
              { 
                title: 'Pending Responses', 
                value: pendingMeetings, 
                icon: '⏳', 
                color: '#8ab4f8',
                description: 'Awaiting response' 
              },
              { 
                title: 'Attachments', 
                value: messages.reduce((acc, m) => acc + (m.attachments?.length || 0), 0), 
                icon: '📎', 
                color: '#ff6d01',
                description: 'Files shared' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(33.333% - 16px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(33.333% - 16px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h4"
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Message Grid */}
          <MessageGrid
            messages={filteredMessages}
            loading={loading}
            search={search}
            onMenuOpen={handleMenuOpen}
            activeTab={activeTab}
          />

          {/* Message Menu */}
          <MessageMenu
            anchorEl={menuAnchor}
            selectedMessage={selectedMessage}
            onClose={handleMenuClose}
            onDelete={handleDeleteMessage}
            onArchive={() => selectedMessage && archiveMessage(selectedMessage._id)}
            onStar={() => selectedMessage && toggleStar(selectedMessage._id)}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}