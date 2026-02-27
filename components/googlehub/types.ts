// components/googlehub/types.ts
import { SxProps, Theme } from '@mui/material'

export interface GoogleHubProps {
  children: React.ReactNode
  sx?: SxProps<Theme>
}

export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  loading?: boolean
  onClick?: () => void
  sx?: SxProps<Theme>
}

export interface SectionProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  loading?: boolean
  sx?: SxProps<Theme>
}

export interface TableColumn<T = any> {
  id: string
  label: string
  render?: (item: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  width?: string | number
  sortable?: boolean
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
  color?: string
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  action?: React.ReactNode
  onClose?: () => void
  sx?: SxProps<Theme>
}

// Google colors
export const googleColors = {
  blue: '#4285f4',
  blueLight: '#e8f0fe',
  blueDark: '#3367d6',
  green: '#34a853',
  greenLight: '#e6f4ea',
  yellow: '#fbbc04',
  yellowLight: '#fef7e0',
  red: '#ea4335',
  redLight: '#fce8e6',
  purple: '#9c27b0',
  purpleLight: '#f3e5f5',
  orange: '#ff9800',
  orangeLight: '#fff3e0',
  teal: '#009688',
  tealLight: '#e0f2f1',
  indigo: '#3f51b5',
  indigoLight: '#e8eaf6',
  grey: '#5f6368',
  greyLight: '#f8f9fa',
  greyBorder: '#dadce0',
  greyDark: '#3c4043',
  white: '#ffffff',
  black: '#202124',
} as const

export type GoogleColor = keyof typeof googleColors