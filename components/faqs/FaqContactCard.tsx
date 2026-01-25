// components/faqs/FaqContactCard.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import { FaqIcons } from './icons/FaqIcons';
import { contactInfo } from './content/FaqContent';

interface FaqContactCardProps {
  onContactClick?: () => void;
}

export const FaqContactCard: React.FC<FaqContactCardProps> = ({ onContactClick }) => {
  const theme = useTheme();
  
  const EmailIcon = FaqIcons.email;
  const PhoneIcon = FaqIcons.phone;
  const ChatIcon = FaqIcons.chat;
  const ScheduleIcon = FaqIcons.schedule;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.1),
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
          Our support team is here to help you get the most out of our platform.
        </Typography>

        <List sx={{ mb: 4 }}>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email Support"
              secondary={contactInfo.email}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{ sx: { opacity: 0.9 } }}
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary="Phone Support"
              secondary={contactInfo.phone}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{ sx: { opacity: 0.9 } }}
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Response Time"
              secondary={contactInfo.responseTime}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{ sx: { opacity: 0.9 } }}
            />
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={onContactClick}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha('#fff', 0.9),
              },
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
            }}
          >
            Chat with Support
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: alpha('#fff', 0.1),
              },
              px: 4,
              py: 1.5,
            }}
          >
            Send Email
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};