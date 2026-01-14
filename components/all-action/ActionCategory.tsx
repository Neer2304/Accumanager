import React from 'react'
import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ActionCard from './ActionCard'
import { ActionsCategory as ActionCategoryType } from './types'

interface ActionCategoryProps {
  category: ActionCategoryType
}

const ActionCategory: React.FC<ActionCategoryProps> = ({ category }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            backgroundColor: category.color,
            borderRadius: 1,
            mr: 2
          }}
        />
        <Typography variant="h5" fontWeight={600}>
          {category.title}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 2, 
            backgroundColor: alpha(category.color, 0.1),
            color: category.color,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 600
          }}
        >
          {category.actions.length} actions
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 2
        }}
      >
        {category.actions.map((action, index) => (
          <ActionCard 
            key={index}
            action={action} 
            categoryColor={category.color} 
          />
        ))}
      </Box>
    </Box>
  )
}

export default ActionCategory