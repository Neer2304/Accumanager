import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { IntegrationSectionProps } from './IntegrationSection.types'

export const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  title,
  subtitle,
  description,
  apiTitle,
  apiDescription,
  benefitsTitle,
  chipVariant = 'filled',
  integrations,
  isMobile
}) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center'
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1 }}>
            <Chip
              label="Integration"
              sx={{
                mb: 2,
                fontWeight: 600
              }}
              color="primary"
              variant="outlined"
            />
            <Typography
              variant={isMobile ? "h4" : "h3"}
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1a237e', // Dark blue
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#333333', // Dark gray
                mb: 2,
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#333333', // Dark gray
                mb: 3,
                lineHeight: 1.7
              }}
            >
              {description}
            </Typography>
            <Stack 
              direction="row" 
              spacing={2}
              sx={{
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              {integrations.chips.map((chip, index) => (
                <Chip 
                  key={index} 
                  label={chip.label} 
                  color={chip.color as any}
                  variant={chipVariant}
                  sx={{
                    fontWeight: 500,
                    '&.MuiChip-filledPrimary': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    },
                    '&.MuiChip-filledSecondary': {
                      backgroundColor: 'secondary.main',
                      color: 'secondary.contrastText'
                    },
                    '&.MuiChip-filledSuccess': {
                      backgroundColor: 'success.main',
                      color: 'success.contrastText'
                    },
                    '&.MuiChip-filledInfo': {
                      backgroundColor: 'info.main',
                      color: 'info.contrastText'
                    },
                    '&.MuiChip-filledWarning': {
                      backgroundColor: 'warning.main',
                      color: 'warning.contrastText'
                    },
                    '&.MuiChip-filledError': {
                      backgroundColor: 'error.main',
                      color: 'error.contrastText'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
          
          {/* Right Content */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: '#ffffff',
                border: '1px solid',
                borderColor: '#e0e0e0',
                boxShadow: 4
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1a237e' // Dark blue
                }}
              >
                {apiTitle}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#333333', // Dark gray
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                {apiDescription}
              </Typography>
              <List dense sx={{ mt: 2 }}>
                {integrations.apiFeatures.map((feature, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      pl: 0,
                      pr: 0,
                      mb: 2,
                      '&:last-child': {
                        mb: 0
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'primary.main',
                      minWidth: 40
                    }}>
                      <CheckCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#333333' // Dark gray
                        }}>
                          {feature.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ 
                          color: '#333333', // Dark gray
                          fontSize: '0.9rem',
                          opacity: 0.9
                        }}>
                          {feature.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}