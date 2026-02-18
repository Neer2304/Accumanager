// components/googlepipelinestages/components/StageForm/NotificationFields.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip as MuiChip,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { GOOGLE_COLORS } from '../../constants';

interface NotificationFieldsProps {
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
  notifyUsers: string[];
  members: any[];
  onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: any) => void;
  darkMode: boolean;
}

export const NotificationFields: React.FC<NotificationFieldsProps> = ({
  notifyOnEnter,
  notifyOnExit,
  notifyUsers,
  members,
  onSwitchChange,
  onSelectChange,
  darkMode
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
        <NotificationsIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle', color: GOOGLE_COLORS.blue }} />
        Notification Settings
      </Typography>

      <FormControlLabel
        control={
          <Switch
            name="notifyOnEnter"
            checked={notifyOnEnter}
            onChange={onSwitchChange}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {notifyOnEnter ? 
              <NotificationsActiveIcon sx={{ color: GOOGLE_COLORS.blue, fontSize: 18 }} /> : 
              <NotificationsOffIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 18 }} />
            }
            <Typography variant="body2">Notify when deals enter this stage</Typography>
          </Box>
        }
        sx={{ mb: 1, width: '100%' }}
      />

      <FormControlLabel
        control={
          <Switch
            name="notifyOnExit"
            checked={notifyOnExit}
            onChange={onSwitchChange}
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {notifyOnExit ? 
              <NotificationsActiveIcon sx={{ color: GOOGLE_COLORS.blue, fontSize: 18 }} /> : 
              <NotificationsOffIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 18 }} />
            }
            <Typography variant="body2">Notify when deals exit this stage</Typography>
          </Box>
        }
        sx={{ mb: 2, width: '100%' }}
      />

      {(notifyOnEnter || notifyOnExit) && (
        <FormControl
          fullWidth
          size="small"
          sx={{
            mt: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: darkMode ? '#303134' : '#fff',
            },
          }}
        >
          <InputLabel>Notify Users</InputLabel>
          <Select
            multiple
            name="notifyUsers"
            value={notifyUsers}
            onChange={onSelectChange}
            label="Notify Users"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => {
                  const member = members.find(m => m.userId === value);
                  return (
                    <MuiChip
                      key={value}
                      label={member?.user?.name || value}
                      size="small"
                      avatar={<Avatar sx={{ width: 20, height: 20 }}>{member?.user?.name?.charAt(0)}</Avatar>}
                      sx={{
                        bgcolor: alpha(GOOGLE_COLORS.blue, 0.1),
                        color: GOOGLE_COLORS.blue,
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {members.map(member => (
              <MenuItem key={member.userId} value={member.userId}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1), color: GOOGLE_COLORS.blue }}>
                    {member.user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{member.user?.name}</Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {member.user?.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};