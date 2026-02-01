"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import { CombinedIcon } from '../ui/icons2';
import { Button2 } from '../ui/button2';
import { Card2 } from '../ui/card2';

interface BackupSettingsProps {
  onBackup: (type: string) => void;
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({ onBackup }) => {
  const [backupMenuAnchor, setBackupMenuAnchor] = useState<null | HTMLElement>(null);

  const handleBackupMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBackupMenuAnchor(event.currentTarget);
  };

  const handleBackupMenuClose = () => {
    setBackupMenuAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
      {/* Backup Options */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Data Backup
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Button2
              variant="contained"
              iconLeft={<CombinedIcon name="Backup" size={16} />}
              onClick={() => onBackup('json')}
              sx={{ flex: 1 }}
            >
              Backup Now (JSON)
            </Button2>
            
            <Button2
              variant="outlined"
              iconLeft={<CombinedIcon name="Download" size={16} />}
              onClick={() => onBackup('csv')}
              sx={{ flex: 1 }}
            >
              Export CSV
            </Button2>
          </Box>

          <Button2
            variant="outlined"
            color="secondary"
            iconLeft={<CombinedIcon name="FileCopy" size={16} />}
            onClick={handleBackupMenuOpen}
            sx={{ mb: 2 }}
          >
            More Backup Options
          </Button2>

          <Menu
            anchorEl={backupMenuAnchor}
            open={Boolean(backupMenuAnchor)}
            onClose={handleBackupMenuClose}
          >
            <MenuItem onClick={() => { onBackup('json'); handleBackupMenuClose(); }}>
              <ListItemIcon>
                <CombinedIcon name="Backup" size={16} />
              </ListItemIcon>
              <ListItemText>Backup All Data (JSON)</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { onBackup('csv'); handleBackupMenuClose(); }}>
              <ListItemIcon>
                <CombinedIcon name="FileCopy" size={16} />
              </ListItemIcon>
              <ListItemText>Export to CSV</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { window.open('/api/settings/qr-code', '_blank'); handleBackupMenuClose(); }}>
              <ListItemIcon>
                <CombinedIcon name="QrCode" size={16} />
              </ListItemIcon>
              <ListItemText>Generate QR Code</ListItemText>
            </MenuItem>
          </Menu>
        </Card2>
      </Box>

      {/* Backup History */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Backup History
        </Typography>
        
        <Card2 sx={{ p: 3, borderRadius: 2 }}>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CombinedIcon name="Backup" size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Full Backup" 
                secondary="Never backed up" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
              <Button2 size="small" variant="outlined" disabled>
                Not Started
              </Button2>
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CombinedIcon name="FileCopy" size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Database Backup" 
                secondary="Last backup: Not available" 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
              />
              <Button2 size="small" variant="outlined" color="warning">
                Pending
              </Button2>
            </ListItem>
          </List>
        </Card2>
      </Box>
    </Box>
  );
};