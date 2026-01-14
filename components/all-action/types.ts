import { ReactNode } from 'react'

export interface ActionItem {
  label: string
  icon: ReactNode
  href: string
  description: string
}

export interface ActionsCategory {
  title: string
  color: string
  actions: ActionItem[]
}