// components/resources/ContactSupport.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as VideoIcon,
  SupportAgent as SupportIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { contactInfo, supportTeam } from './data/contactInfo';

interface ContactSupportProps {
  compact?: boolean;
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ compact = false }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: compact ? 3 : { xs: 3, md: 5 },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, compact ? 0.9 : 0.95)} 0%, ${alpha(theme.palette.primary.dark, compact ? 0.9 : 0.95)} 100%)`,
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
        {!compact && (
          <>
            <SupportIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Need Personalized Assistance?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600 }}>
              Our support team is ready to help you with any questions
            </Typography>
          </>
        )}

        {compact ? (
          // Compact version
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { icon: <PhoneIcon />, label: 'Call', action: `tel:${contactInfo.phone}` },
              { icon: <WhatsAppIcon />, label: 'WhatsApp', action: `https://wa.me/${contactInfo.whatsapp.replace('+', '')}` },
              { icon: <EmailIcon />, label: 'Email', action: `mailto:${contactInfo.email}` },
            ].map((item, index) => (
              <Button
                key={index}
                variant="contained"
                startIcon={item.icon}
                onClick={() => window.open(item.action, '_blank')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: alpha('#fff', 0.9) },
                  fontWeight: 'bold',
                  flex: 1,
                  minWidth: 120,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        ) : (
          // Full version
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  Contact Information
                </Typography>
                <List sx={{ mb: 2 }}>
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
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Support Hours"
                      secondary={contactInfo.hours}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ sx: { opacity: 0.9 } }}
                    />
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupportIcon />
                  Support Teams
                </Typography>
                <List dense>
                  {supportTeam.map((team, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={team.name}
                        secondary={`${team.email} • ${team.phone}`}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ sx: { opacity: 0.9, fontSize: '0.8rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PhoneIcon />}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: alpha('#fff', 0.9) },
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                }}
                onClick={() => window.open(`tel:${contactInfo.phone}`, '_blank')}
              >
                Call Support
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
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
                onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp.replace('+', '')}`, '_blank')}
              >
                WhatsApp
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<VideoIcon />}
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
                onClick={() => window.open(contactInfo.calendly, '_blank')}
              >
                Book Training
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};