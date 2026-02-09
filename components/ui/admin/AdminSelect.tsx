'use client'

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

interface AdminSelectProps {
  label: string
  options: { value: string; label: string }[]
  defaultValue?: string
  value?: string
  onChange?: (event: any) => void
}

export default function AdminSelect({ 
  label, 
  options, 
  defaultValue,
  value,
  onChange,
  ...props 
}: AdminSelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        size="small"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        sx={{
          borderRadius: 1,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}