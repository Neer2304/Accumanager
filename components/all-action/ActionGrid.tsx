import React from 'react'
import { Container } from '@mui/material'
import ActionCategory from './ActionCategory'
import { ActionsCategory as ActionCategoryType } from './types'

interface ActionGridProps {
  categories: ActionCategoryType[]
}

const ActionGrid: React.FC<ActionGridProps> = ({ categories }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
      {categories.map((category, index) => (
        <ActionCategory key={index} category={category} />
      ))}
    </Container>
  )
}

export default ActionGrid