"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Send,
  Search,
  AttachFile,
  EmojiEmotions,
  Group,
  PersonAdd,
  Chat as ChatIcon,
  VideoCall,
  Phone,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

export default function TeamChatPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // In a real app, you would fetch data from API here
  // useEffect(() => {
  //   fetchChatData();
  // }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // API call to send message would go here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <MainLayout title="Team Chat">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Team Chat
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time collaboration and communication
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Group />}
                // onClick={() => window.location.href = '/team/chat/groups'}
              >
                Create Group
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                // onClick={() => window.location.href = '/team/chat/invite'}
              >
                Invite People
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Chat Area */}
        <Card sx={{ height: 'calc(100vh - 200px)' }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Team Chat
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Loading conversations...
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" title="Voice call">
                  <Phone />
                </IconButton>
                <IconButton size="small" title="Video call">
                  <VideoCall />
                </IconButton>
              </Box>
            </Box>

            {/* Chat Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <CircularProgress />
                  <Typography color="text.secondary">
                    Loading chat messages...
                  </Typography>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Chat API integration is required to load messages. Connect to your backend to enable real-time chat.
                </Alert>
              )}
            </Box>

            {/* Message Input */}
            <Box sx={{ 
              p: 2, 
              borderTop: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
              bgcolor: darkMode ? '#303134' : '#f8f9fa'
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton>
                  <AttachFile />
                </IconButton>
                <IconButton>
                  <EmojiEmotions />
                </IconButton>
                <TextField
                  fullWidth
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          color="primary"
                        >
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Sidebar for desktop */}
        {!isMobile && (
          <Card sx={{ position: 'fixed', right: 24, top: 120, width: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ChatIcon />}
                  // onClick={() => window.location.href = '/team/chat/direct'}
                >
                  New Direct Message
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Group />}
                  // onClick={() => window.location.href = '/team/chat/channels'}
                >
                  Browse Channels
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonAdd />}
                  // onClick={() => window.location.href = '/team/chat/invite'}
                >
                  Invite Members
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
}