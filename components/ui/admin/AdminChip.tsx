import { Chip, ChipProps } from '@mui/material'

interface AdminChipProps extends ChipProps {
  status: 'active' | 'paused' | 'pending' | 'completed'
}

export default function AdminChip({ status, ...props }: AdminChipProps) {
  const statusConfig = {
    active: { label: 'Active', color: '#0f9d58' as const },
    paused: { label: 'Paused', color: '#db4437' as const },
    pending: { label: 'Pending', color: '#f4b400' as const },
    completed: { label: 'Completed', color: '#4285f4' as const },
  }

  return (
    <Chip
      label={statusConfig[status]?.label || status}
      size="small"
      sx={{
        bgcolor: `${statusConfig[status]?.color}15`,
        color: statusConfig[status]?.color,
        fontWeight: 500,
        borderRadius: 1,
        border: '1px solid',
        borderColor: `${statusConfig[status]?.color}30`,
        ...props.sx,
      }}
      {...props}
    />
  )
}