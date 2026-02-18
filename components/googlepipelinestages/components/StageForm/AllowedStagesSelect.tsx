// components/googlepipelinestages/components/StageForm/AllowedStagesSelect.tsx
import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip as MuiChip,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { GOOGLE_COLORS } from '../../constants';

interface AllowedStagesSelectProps {
  allowedStages: string[];
  stages: any[];
  selectedStageId?: string;
  onSelectChange: (e: any) => void;
  darkMode: boolean;
}

export const AllowedStagesSelect: React.FC<AllowedStagesSelectProps> = ({
  allowedStages,
  stages,
  selectedStageId,
  onSelectChange,
  darkMode
}) => {
  const filteredStages = stages.filter(s => s._id !== selectedStageId);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 2 }}>
        <ArrowForwardIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle', color: GOOGLE_COLORS.orange }} />
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
          value={allowedStages}
          onChange={onSelectChange}
          label="Allowed Stages"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <MuiChip
                  key={value}
                  label={value}
                  size="small"
                  icon={<LockOpenIcon />}
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.orange, 0.1),
                    color: GOOGLE_COLORS.orange,
                    '& .MuiChip-icon': { color: GOOGLE_COLORS.orange }
                  }}
                />
              ))}
            </Box>
          )}
        >
          {filteredStages.length > 0 ? (
            filteredStages.map(stage => (
              <MenuItem key={stage._id} value={stage.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {allowedStages.includes(stage.name) ? (
                    <LockOpenIcon sx={{ color: GOOGLE_COLORS.orange, fontSize: 18 }} />
                  ) : (
                    <LockIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', fontSize: 18 }} />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: stage.color }} />
                    {stage.name}
                  </Box>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                No other stages available
              </Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
      
      {allowedStages.length === 0 && (
        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mt: 1, display: 'block' }}>
          All stages are allowed to follow this stage
        </Typography>
      )}
    </Box>
  );
};