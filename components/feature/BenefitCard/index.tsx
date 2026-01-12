import React from 'react'
import { Paper, Box, Typography, styled, keyframes } from '@mui/material'
import { Icon } from '@/components/common/Icon'
import { BenefitCardProps } from './BenefitCard.types'

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'gradient'
})<{ gradient?: string }>(({ theme, gradient }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.spacing(3),
  background: gradient || `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[10]
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    zIndex: 1
  }
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: '3rem',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
  animation: `${floatAnimation} 3s ease-in-out infinite`
}))

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
}))

const Description = styled(Typography)(({ theme }) => ({
  opacity: 0.9,
  lineHeight: 1.6,
  fontSize: '1rem'
}))

export const BenefitCard: React.FC<BenefitCardProps> = ({ benefit }) => {
  return (
    <StyledPaper gradient={benefit.gradient}>
      <ContentWrapper>
        <IconWrapper>
          <Icon 
            name={benefit.iconName} 
            fontSize={48}
            sx={{ 
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
              animation: `${floatAnimation} 3s ease-in-out infinite`
            }}
          />
        </IconWrapper>
        <Title variant="h5">
          {benefit.title}
        </Title>
        <Description variant="body1">
          {benefit.description}
        </Description>
      </ContentWrapper>
    </StyledPaper>
  )
}