import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  alpha
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { Icon } from '@/components/common/Icon'
import { CategoryCardProps } from './CategoryCard.types'

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const color = category.color || 'primary.main'

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        background: 'white', // Explicit white background
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: (theme) => theme.shadows[10],
          '&::before': {
            transform: 'scaleX(1)'
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: color,
          transform: 'scaleX(0)',
          transition: 'transform 0.3s ease',
          zIndex: 1
        }
      }}
    >
      <CardContent sx={{ 
        p: { xs: 3, sm: 4 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 3 
        }}>
          <Box sx={{ 
            color: color, 
            mb: 2,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Icon name={category.iconName} fontSize={40} color={color} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: '#333333', // Dark text for title
              fontSize: '1.5rem'
            }}
          >
            {category.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666666', // Medium gray for description
              mb: 0,
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}
          >
            {category.description}
          </Typography>
        </Box>

        <Divider sx={{ 
          my: 2,
          backgroundColor: alpha(color, 0.2)
        }} />

        {/* Features List */}
        <List dense sx={{ flexGrow: 1 }}>
          {category.features.slice(0, 3).map((feature) => (
            <ListItem 
              key={feature.id} 
              sx={{ 
                px: 0,
                mb: 1.5,
                '&:last-child': {
                  mb: 0
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: feature.color || color, 
                minWidth: 36 
              }}>
                <Icon name={feature.iconName} fontSize={24} color={feature.color || color} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    mb: 0.5,
                    color: '#333333' // Dark text for feature title
                  }}>
                    {feature.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ 
                    color: '#666666', // Medium gray for feature description
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    {feature.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3
        }}>
          <Chip
            label={`${category.features.length} features`}
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              color: color,
              fontWeight: 500,
              border: 'none'
            }}
          />
          <Button
            size="small"
            endIcon={<ArrowForward />}
            sx={{
              color: color,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.85rem',
              '&:hover': {
                backgroundColor: alpha(color, 0.1)
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}