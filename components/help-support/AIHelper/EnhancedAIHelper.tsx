import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { AI_HELPER_CONTENT } from './AIHelperContent';
import { useAIApi } from './hooks/useAIApi';

export const EnhancedAIHelper: React.FC = () => {
  const {
    conversation,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  } = useAIApi();

  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const { button, dialog } = AI_HELPER_CONTENT;

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<HelpSupportIcon name="AI" />}
        onClick={openDialog}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "25px",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          background: button.gradient,
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        {button.text}
      </Button>

      <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <HelpSupportIcon name="AI" color="primary" />
              <Typography variant="h6">{dialog.title}</Typography>
            </Box>
            <IconButton onClick={closeDialog}>
              <HelpSupportIcon name="Close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Quick Action Chips */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {dialog.quickQuestions}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {AI_HELPER_CONTENT.quickActions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  size="small"
                  onClick={() => {
                    setMessage(action);
                    sendMessage(action);
                  }}
                  variant="outlined"
                  clickable
                />
              ))}
            </Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Conversation */}
          <Box
            sx={{
              maxHeight: 300,
              overflow: "auto",
              mb: 2,
              p: 1,
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            {conversation.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                Ask me anything about AccumaManage features, issues, or setup!
              </Typography>
            ) : (
              conversation.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: "80%",
                      bgcolor: msg.role === "user" ? "primary.main" : "background.paper",
                      color: msg.role === "user" ? "white" : "text.primary",
                    }}
                  >
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body2">{msg.content}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            )}
            {isLoading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          {/* Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder={dialog.placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            size="small"
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <HelpSupportIcon name="Send" />
                  )}
                </IconButton>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={clearConversation}>{dialog.clearChat}</Button>
          <Button
            variant="contained"
            onClick={handleSend}
            endIcon={<HelpSupportIcon name="Send" />}
            disabled={!message.trim() || isLoading}
          >
            {dialog.send}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};