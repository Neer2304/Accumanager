import { Box, Card, CardContent, Typography, Alert } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface InsightsPanelProps {
  insights: any[]
  currentColors: any
  googleColors: any
  mode: string
  alpha: any
}

export default function InsightsPanel({
  insights,
  currentColors,
  googleColors,
  mode,
  alpha
}: InsightsPanelProps) {
  return (
    <Card
      sx={{
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        boxShadow: mode === 'dark' 
          ? '0 2px 4px rgba(0,0,0,0.4)' 
          : '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Insights & Recommendations
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {insights.map((insight: any, index: number) => (
            <Box key={index}>
              <Alert
                severity={insight.type}
                sx={{
                  background: getAlertBackground(insight.type, mode, googleColors, alpha),
                  border: `1px solid ${getAlertBorder(insight.type, mode, googleColors, alpha)}`,
                  borderRadius: '12px',
                  alignItems: 'flex-start',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: currentColors.textSecondary }}>
                    {insight.message}
                  </Typography>
                  {insight.suggestion && (
                    <Typography variant="caption" sx={{ 
                      mt: 1, 
                      display: 'block', 
                      fontStyle: 'italic',
                      color: currentColors.textSecondary 
                    }}>
                      💡 {insight.suggestion}
                    </Typography>
                  )}
                </Box>
              </Alert>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

function getAlertBackground(type: string, mode: string, googleColors: any, alpha: any) {
  const lightMode = mode === 'light'
  switch (type) {
    case 'success':
      return lightMode ? alpha(googleColors.green, 0.08) : alpha(googleColors.green, 0.15)
    case 'warning':
      return lightMode ? alpha(googleColors.yellow, 0.08) : alpha(googleColors.yellow, 0.15)
    case 'error':
      return lightMode ? alpha(googleColors.red, 0.08) : alpha(googleColors.red, 0.15)
    default:
      return lightMode ? alpha(googleColors.blue, 0.08) : alpha(googleColors.blue, 0.15)
  }
}

function getAlertBorder(type: string, mode: string, googleColors: any, alpha: any) {
  const lightMode = mode === 'light'
  switch (type) {
    case 'success':
      return lightMode ? alpha(googleColors.green, 0.2) : alpha(googleColors.green, 0.3)
    case 'warning':
      return lightMode ? alpha(googleColors.yellow, 0.2) : alpha(googleColors.yellow, 0.3)
    case 'error':
      return lightMode ? alpha(googleColors.red, 0.2) : alpha(googleColors.red, 0.3)
    default:
      return lightMode ? alpha(googleColors.blue, 0.2) : alpha(googleColors.blue, 0.3)
  }
}