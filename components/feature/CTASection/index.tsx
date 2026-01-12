import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  Button, 
  styled 
} from '@mui/material'
import Link from 'next/link'
import { CTASectionProps } from './CTASection.types'

const Root = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0)
  }
}))

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'gradient'
})<{ gradient?: string }>(({ theme, gradient }) => ({
  padding: theme.spacing(6, 4),
  textAlign: 'center',
  background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  borderRadius: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    zIndex: 1
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8)
  }
}))

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: 'white',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
    lineHeight: 1.2
  }
}))

const Subtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: 'white',
  opacity: 0.9,
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem'
  }
}))

const ButtonContainer = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  position: 'relative',
  zIndex: 2
}))

const TrialButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  transition: 'all 0.3s ease'
}))

const PricingButton = styled(Button)(({ theme }) => ({
  borderColor: 'white',
  color: 'white',
  fontWeight: 500,
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.3s ease'
}))

const DashboardButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  },
  transition: 'all 0.3s ease'
}))

const TrialMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  opacity: 0.9,
  color: 'white',
  position: 'relative',
  zIndex: 2,
  fontSize: theme.typography.pxToRem(14),
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.pxToRem(12)
  }
}))

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  trialButton,
  pricingButton,
  dashboardButton,
  trialMessage,
  gradient,
  buttonVariant = 'contained',
  isAuthenticated,
  authLoading,
  isMobile
}) => {
  return (
    <Root>
      <Container maxWidth="md">
        <StyledPaper gradient={gradient}>
          <Title variant={isMobile ? "h4" : "h3"}>
            {title}
          </Title>
          <Subtitle variant={isMobile ? "body1" : "h6"}>
            {subtitle}
          </Subtitle>
          
          <ButtonContainer
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            {!isAuthenticated && !authLoading ? (
              <>
                <TrialButton
                  variant={buttonVariant}
                  size={isMobile ? "medium" : "large"}
                  // component={Link}
                  href="/dashboard"
                >
                  {trialButton}
                </TrialButton>
                <PricingButton
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  // component={Link}
                  href="/pricing"
                >
                  {pricingButton}
                </PricingButton>
              </>
            ) : (
              <DashboardButton
                variant={buttonVariant}
                size={isMobile ? "medium" : "large"}
                // component={Link}
                href="/dashboard"
              >
                {dashboardButton}
              </DashboardButton>
            )}
          </ButtonContainer>
          
          {!isAuthenticated && !authLoading && (
            <TrialMessage variant="body2">
              {trialMessage}
            </TrialMessage>
          )}
        </StyledPaper>
      </Container>
    </Root>
  )
}