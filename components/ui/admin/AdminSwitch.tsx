import { Switch, SwitchProps, FormControlLabel } from '@mui/material'

interface AdminSwitchProps extends SwitchProps {
  label: string
}

export default function AdminSwitch({ label, ...props }: AdminSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          {...props}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#4285f4',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#4285f4',
            },
          }}
        />
      }
      label={label}
      sx={{ 
        m: 0,
        '& .MuiTypography-root': {
          fontWeight: 500,
        }
      }}
    />
  )
}