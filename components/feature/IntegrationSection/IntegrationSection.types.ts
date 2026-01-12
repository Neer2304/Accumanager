import { Integrations } from '@/data/featuresContent'

export interface IntegrationSectionProps {
  title: string
  subtitle: string
  description: string
  apiTitle: string
  apiDescription: string
  benefitsTitle: string
  chipVariant?: 'filled' | 'outlined'
  integrations: Integrations
  isMobile: boolean
}