import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GradientButtonProps extends ButtonProps {
  gradient?: string;
}

export const GradientButton = styled(Button)<GradientButtonProps>(
  ({ theme, gradient }) => ({
    background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    '&:hover': {
      opacity: 0.9,
    },
  })
);