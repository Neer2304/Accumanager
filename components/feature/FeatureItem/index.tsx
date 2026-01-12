import React from 'react'
import { Paper, Box, Typography, Chip } from '@mui/material'
import { Icon } from '@/components/common/Icon'
import { useFeatureItemStyles } from './FeatureItem.styles'
import { FeatureItemProps } from './FeatureItem.types'

export const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  const classes = useFeatureItemStyles({ color: feature.color, highlight: feature.highlight })

  return (
    <Paper className={classes.featureRoot}>
      <Box className={classes.featureContent}>
        <Box className={classes.iconContainer}>
          <Icon name={feature.iconName} fontSize={32} color={feature.color} />
          {feature.highlight && (
            <Chip 
              label="Popular" 
              size="small" 
              className={classes.highlightChip}
            />
          )}
        </Box>
        <Typography variant="h6" className={classes.title}>
          {feature.title}
        </Typography>
        <Typography variant="body2" className={classes.description}>
          {feature.description}
        </Typography>
      </Box>
    </Paper>
  )
}