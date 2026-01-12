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
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { AI_HELPER_CONTENT } from './AIHelperContent';
import { useAIHelper } from './hooks/useAIHelper';

export const AIHelper: React.FC = () => {
  const {
    conversation,
    message,
    isOpen,
    sendMessage,
    setMessage,
    openDialog,
    closeDialog,
    clearConversation,
  } = useAIHelper();

  const { button, dialog } = AI_HELPER_CONTENT;

  return (
    <>
      {/* Floating AI Help Button */}
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

      {/* AI Helper Dialog */}
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
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
                    justifyContent:
                      msg.type === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: "80%",
                      bgcolor:
                        msg.type === "user"
                          ? "primary.main"
                          : "background.paper",
                      color: msg.type === "user" ? "white" : "text.primary",
                    }}
                  >
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Typography variant="body2">{msg.text}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            )}
          </Box>

          {/* Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder={dialog.placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage(message)}
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => sendMessage(message)}
                  disabled={!message.trim()}
                >
                  <HelpSupportIcon name="Send" />
                </IconButton>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={clearConversation}>{dialog.clearChat}</Button>
          <Button
            variant="contained"
            onClick={() => sendMessage(message)}
            endIcon={<HelpSupportIcon name="Send" />}
            disabled={!message.trim()}
          >
            {dialog.send}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};