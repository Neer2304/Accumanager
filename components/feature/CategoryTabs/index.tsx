import React from 'react'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { CategoryTabsProps } from './CategoryTabs.types'

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  tabs, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <ToggleButtonGroup
      value={activeCategory}
      exclusive
      onChange={onCategoryChange}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        '& .MuiToggleButtonGroup-grouped': {
          m: 0.5,
          border: 0,
          '&:not(:first-of-type)': {
            borderRadius: 2
          },
          '&:first-of-type': {
            borderRadius: 2
          }
        }
      }}
    >
      {tabs.map((tab) => (
        <ToggleButton 
          key={tab.id} 
          value={tab.id}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            color: 'text.secondary',
            fontWeight: 500,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'text.primary'
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText'
              }
            }
          }}
        >
          {tab.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}