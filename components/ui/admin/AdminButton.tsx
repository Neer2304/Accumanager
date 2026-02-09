import { Button, ButtonProps } from '@mui/material'

interface AdminButtonProps extends ButtonProps {
  children: React.ReactNode
}

export default function AdminButton({ children, ...props }: AdminButtonProps) {
  return (
    <Button
      variant="contained"
      sx={{
        borderRadius: 1.5,
        textTransform: 'none',
        fontWeight: 500,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}