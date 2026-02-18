// components/googlepipelinestages/components/StagesDialogs/EditStageDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip as MuiChip,
  Avatar,
  useTheme,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { BasicInfoFields } from '../StageForm/BasicInfoFields';
import { ColorPickerField } from '../StageForm/ColorPickerField';
import { GOOGLE_COLORS, REQUIRED_FIELD_OPTIONS } from '../../constants';

interface EditStageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: any;
  validationErrors: Record<string, string>;
  members: any[];
  stages: any[];
  selectedStage: any;
  colorPickerOpen: boolean;
  onColorPickerToggle: () => void;
  onColorPickerClose: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: any) => void;
  onSwitchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (color: any) => void;
  submitting: boolean;
  darkMode: boolean;
}

export const EditStageDialog: React.FC<EditStageDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  validationErrors,
  members,
  stages,
  selectedStage,
  colorPickerOpen,
  onColorPickerToggle,
  onColorPickerClose,
  onInputChange,
  onSelectChange,
  onSwitchChange,
  onColorChange,
  submitting,
  darkMode
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: darkMode ? '#2d2e30' : '#fff',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
        px: 4,
        py: 2.5,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Edit Pipeline Stage
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Update stage configuration
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={submitting}
            size="small"
            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Info Fields */}
          <BasicInfoFields
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
          />

          {/* Color Picker */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={onSwitchChange}
                />
              }
              label="Active"
            />
            <ColorPickerField
              color={formData.color}
              open={colorPickerOpen}
              onToggle={onColorPickerToggle}
              onChange={onColorChange}
              onClose={onColorPickerClose}
            />
          </Box>

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Auto Advance */}
          <FormControlLabel
            control={
              <Switch
                name="autoAdvance"
                checked={formData.autoAdvance}
                onChange={onSwitchChange}
              />
            }
            label="Automatically advance deals after X days"
          />

          {formData.autoAdvance && (
            <TextField
              fullWidth
              label="Days to auto-advance *"
              name="autoAdvanceDays"
              type="number"
              value={formData.autoAdvanceDays}
              onChange={onInputChange}
              error={!!validationErrors.autoAdvanceDays}
              helperText={validationErrors.autoAdvanceDays}
              size="small"
              InputProps={{
                inputProps: { min: 1 }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: darkMode ? '#303134' : '#fff',
                },
              }}
            />
          )}

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Notifications */}
          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Notifications
          </Typography>

          <FormControlLabel
            control={
              <Switch
                name="notifyOnEnter"
                checked={formData.notifyOnEnter}
                onChange={onSwitchChange}
              />
            }
            label="Notify when deals enter this stage"
          />

          <FormControlLabel
            control={
              <Switch
                name="notifyOnExit"
                checked={formData.notifyOnExit}
                onChange={onSwitchChange}
              />
            }
            label="Notify when deals exit this stage"
          />

          {/* Notify Users */}
          {(formData.notifyOnEnter || formData.notifyOnExit) && (
            <FormControl
              fullWidth
              size="small"
              sx={{
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
                value={formData.notifyUsers}
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
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {members.map(member => (
                  <MenuItem key={member.userId} value={member.userId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: GOOGLE_COLORS.blue }}>
                        {member.user?.name?.charAt(0)}
                      </Avatar>
                      {member.user?.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Divider sx={{ borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          {/* Required Fields */}
          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Required Fields
          </Typography>

          <FormControl
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          >
            <InputLabel>Required Fields</InputLabel>
            <Select
              multiple
              name="requiredFields"
              value={formData.requiredFields}
              onChange={onSelectChange}
              label="Required Fields"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <MuiChip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {REQUIRED_FIELD_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Allowed Next Stages */}
          <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            Allowed Next Stages
          </Typography>

          <FormControl
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: darkMode ? '#303134' : '#fff',
              },
            }}
          >
            <InputLabel>Allowed Stages</InputLabel>
            <Select
              multiple
              name="allowedStages"
              value={formData.allowedStages}
              onChange={onSelectChange}
              label="Allowed Stages"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <MuiChip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {stages
                .filter(s => s._id !== selectedStage?._id)
                .map(stage => (
                  <MenuItem key={stage._id} value={stage.name}>
                    {stage.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        bgcolor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            borderRadius: '24px',
            color: darkMode ? '#9aa0a6' : '#5f6368',
            borderColor: darkMode ? '#3c4043' : '#dadce0',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <EditIcon />}
          sx={{
            borderRadius: '24px',
            bgcolor: GOOGLE_COLORS.blue,
            '&:hover': { bgcolor: '#1557b0' },
            px: 4
          }}
        >
          {submitting ? 'Updating...' : 'Update Stage'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};