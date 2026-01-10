// components/AIHelper.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Close, SmartToy, Send } from '@mui/icons-material';

const AIHelper: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string}>>([]);

  // Pre-defined responses based on keywords
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('dashboard') || lowerMessage.includes('data')) {
      return "I see you're asking about dashboard data. Make sure your API endpoints are returning the correct format and check if there are any CORS issues. Would you like me to check your API integration?";
    }
    
    if (lowerMessage.includes('error') || lowerMessage.includes('issue')) {
      return "For errors, please check the browser console (F12) for detailed error messages. Also ensure all dependencies are properly installed and APIs are running.";
    }
    
    if (lowerMessage.includes('user') || lowerMessage.includes('trial')) {
      return "For user data issues, verify your database queries and ensure user authentication is working properly. Check if user roles and permissions are set correctly.";
    }
    
    if (lowerMessage.includes('api') || lowerMessage.includes('endpoint')) {
      return "API issues can be due to incorrect endpoints, authentication problems, or CORS settings. Let me help you debug your API calls.";
    }
    
    if (lowerMessage.includes('login') || lowerMessage.includes('auth')) {
      return "Authentication issues often involve token management, session storage, or backend validation. Check your auth flow step by step.";
    }

    return "I understand you need help. Could you provide more specific details about what you're trying to achieve or the exact error you're facing? This will help me assist you better.";
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg = { type: 'user' as const, text: message };
    setConversation(prev => [...prev, userMsg]);

    // Get AI response
    const aiResponse = getAIResponse(message);
    setTimeout(() => {
      setConversation(prev => [...prev, { type: 'ai', text: aiResponse }]);
    }, 1000);

    setMessage('');
  };

  const quickActions = [
    "Dashboard not loading data",
    "API connection issues",
    "User authentication problem",
    "Database sync error",
    "How to add new feature?"
  ];

  return (
    <>
      {/* Floating Help Button */}
      <Button
        variant="contained"
        startIcon={<SmartToy />}
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50px',
          zIndex: 1000
        }}
      >
        AI Helper
      </Button>

      {/* Help Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToy color="primary" />
              <Typography variant="h6">AI Development Helper</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Quick Action Chips */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Quick questions:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {quickActions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  size="small"
                  onClick={() => setMessage(action)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          {/* Conversation */}
          <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
            {conversation.map((msg, index) => (
              <Card key={index} sx={{ mb: 1, bgcolor: msg.type === 'ai' ? 'action.hover' : 'background.paper' }}>
                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {msg.type === 'user' ? 'You' : 'AI Helper'}:
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Describe your issue or ask for help..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConversation([])}>
            Clear Chat
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSendMessage}
            endIcon={<Send />}
            disabled={!message.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIHelper;