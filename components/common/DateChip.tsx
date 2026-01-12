import { Chip, SxProps, Theme } from '@mui/material';

interface DateChipProps {
  date: string;
  label?: string;
  variant?: 'filled' | 'outlined';
  sx?: SxProps<Theme>;
}

export const DateChip = ({ 
  date, 
  label = "Updated", 
  variant = 'outlined',
  sx 
}: DateChipProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Chip 
      label={`${label}: ${formatDate(date)}`}
      variant={variant}
      sx={sx}
    />
  );
};