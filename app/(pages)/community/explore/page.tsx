// app/community/explore/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  IconButton,
  InputBase,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as VerifiedIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  avatar?: string;
  bio?: string;
  userId: {
    _id: string;
    name: string;
    role: string;
  };
  isVerified?: boolean;
  isFollowing?: boolean;
}

export default function ExplorePage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/community/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUserProfile(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/community/explore', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          let filteredUsers = data.data || [];
          if (currentUserProfile) {
            filteredUsers = filteredUsers.filter((user: User) => 
              user.userId?._id !== currentUserProfile.userId?._id && 
              user._id !== currentUserProfile._id
            );
          }
          setUsers(filteredUsers);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/community/profile/${user.username}/follow`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(u => 
            u._id === user._id ? { ...u, isFollowing: true } : u
          ));
        }
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/community/profile/${user.username}/follow`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(u => 
            u._id === user._id ? { ...u, isFollowing: false } : u
          ));
        }
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/community/profile/${username}`);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: darkMode ? '#202124' : '#ffffff',
    }}>
      {/* Sticky Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: darkMode ? '#202124' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        py: 2,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => router.push('/community')}
              sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Discover People
            </Typography>
            
            <Box sx={{ flex: 1, maxWidth: 400, ml: 'auto' }}>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  bgcolor: darkMode ? '#303134' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
              >
                <SearchIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 20 }} />
                <InputBase
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    ml: 1, 
                    flex: 1, 
                    fontSize: '0.9rem',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}
                />
                {searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4285f4' }} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PeopleIcon sx={{ fontSize: 64, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              No people found
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 1 }}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new people to connect with'}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {filteredUsers.length} people found
              </Typography>
              <Chip 
                label={`${users.filter(u => u.isFollowing).length} following`}
                size="small"
                sx={{
                  bgcolor: alpha('#34a853', 0.1),
                  color: '#34a853',
                }}
              />
            </Box>

            {/* People Grid */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}>
              {filteredUsers.map((user) => (
                <Card 
                  key={user._id}
                  onClick={() => handleUserClick(user.username)}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: darkMode ? '#202124' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                      borderColor: '#4285f4',
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={user.avatar}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          bgcolor: '#4285f4',
                        }}
                      >
                        {user.userId?.name?.charAt(0) || 'U'}
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight={600} 
                            sx={{ 
                              color: darkMode ? '#e8eaed' : '#202124',
                              fontSize: '0.95rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.userId?.name || 'Unknown'}
                          </Typography>
                          {user.isVerified && (
                            <VerifiedIcon sx={{ fontSize: 14, color: '#4285f4' }} />
                          )}
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: darkMode ? '#9aa0a6' : '#5f6368',
                            display: 'block',
                          }}
                        >
                          @{user.username}
                        </Typography>
                        
                        {user.bio && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1,
                              fontSize: '0.75rem',
                              color: darkMode ? '#9aa0a6' : '#5f6368',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {user.bio}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant={user.isFollowing ? "outlined" : "contained"}
                      size="small"
                      startIcon={!user.isFollowing && <PersonAddIcon />}
                      onClick={(e) => user.isFollowing ? handleUnfollow(e, user) : handleFollow(e, user)}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        ...(user.isFollowing ? {
                          borderColor: darkMode ? '#5f6368' : '#dadce0',
                          color: darkMode ? '#e8eaed' : '#202124',
                          '&:hover': {
                            borderColor: '#4285f4',
                            bgcolor: alpha('#4285f4', 0.05),
                          },
                        } : {
                          bgcolor: '#4285f4',
                          '&:hover': {
                            bgcolor: '#3367d6',
                          },
                        }),
                      }}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}