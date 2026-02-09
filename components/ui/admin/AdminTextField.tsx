import { TextField, TextFieldProps } from '@mui/material'

export default function AdminTextField(props: TextFieldProps) {
  return (
    <TextField
      size="small"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
          '& fieldset': {
            borderColor: 'divider',
          },
        },
      }}
      {...props}
    />
  )
}