import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton, // Add this import
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  expandedSection: string | null;
  onSectionClick: (section: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  open,
  onClose,
  expandedSection,
  onSectionClick,
}) => {
  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'details', label: 'Employee Details' },
    { id: 'attendance', label: 'Attendance Records' },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 280,
          p: 2,
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          Quick Navigation
        </Typography>
      </Box>
      <List>
        {sections.map(({ id, label }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemButton
              onClick={() => {
                onSectionClick(id);
                onClose();
              }}
              sx={{
                borderRadius: 1,
                bgcolor: expandedSection === id ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemText
                primary={
                  <Typography fontWeight={expandedSection === id ? 'bold' : 'normal'}>
                    {label}
                  </Typography>
                }
              />
              {expandedSection === id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};