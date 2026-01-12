import React from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  alpha
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import { Icon } from '@/components/common/Icon'
import { MobileAccordionProps } from './MobileAccordion.types'

const Root = styled(Box)({
  width: '100%'
})

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '16px !important',
  overflow: 'hidden',
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: theme.spacing(0, 0, 2, 0)
  }
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.light, 0.1),
  borderRadius: theme.spacing(2),
  '&.Mui-expanded': {
    minHeight: 48,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
}))

const SummaryContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%'
}))

const CategoryIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '1.5rem'
}))

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary
}))

const CategoryDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem'
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default
}))

const FeatureList = styled(List)(({ theme }) => ({
  padding: 0
}))

const FeatureItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}))

const FeatureIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  minWidth: 40
}))

const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem'
}))

const FeatureDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem'
}))

export const MobileAccordion: React.FC<MobileAccordionProps> = ({ categories }) => {
  return (
    <Root>
      <Title variant="h5">
        All Features
      </Title>
      {categories.map((category) => (
        <StyledAccordion key={category.id}>
          <StyledAccordionSummary expandIcon={<ExpandMore />}>
            <SummaryContent>
              <CategoryIcon sx={{ color: category.color }}>
                <Icon name={category.iconName} fontSize={24} color={category.color} />
              </CategoryIcon>
              <Box>
                <CategoryTitle variant="h6">
                  {category.title}
                </CategoryTitle>
                <CategoryDescription variant="body2">
                  {category.description}
                </CategoryDescription>
              </Box>
            </SummaryContent>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <FeatureList dense>
              {category.features.map((feature) => (
                <FeatureItem key={feature.id}>
                  <FeatureIcon sx={{ color: feature.color }}>
                    <Icon name={feature.iconName} fontSize={24} color={feature.color} />
                  </FeatureIcon>
                  <ListItemText
                    primary={
                      <FeatureTitle variant="subtitle1">
                        {feature.title}
                      </FeatureTitle>
                    }
                    secondary={
                      <FeatureDescription variant="body2">
                        {feature.description}
                      </FeatureDescription>
                    }
                  />
                </FeatureItem>
              ))}
            </FeatureList>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </Root>
  )
}