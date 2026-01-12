export interface CTASectionProps {
  title: string
  subtitle: string
  trialButton: string
  pricingButton: string
  dashboardButton: string
  trialMessage: string
  gradient?: string
  buttonVariant?: 'contained' | 'outlined'
  isAuthenticated: boolean
  authLoading: boolean
  isMobile: boolean
}