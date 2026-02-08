import { Box, Card, CardContent, Typography, LinearProgress, Chip, Paper, Divider } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface HealthAnalysisProps {
  healthMetrics: any;
  currentColors: any;
  googleColors: any;
  primaryColor: string;
  isMobile: boolean;
  alpha: any;
}

export default function HealthAnalysis({
  healthMetrics,
  currentColors,
  googleColors,
  primaryColor,
  isMobile,
  alpha
}: HealthAnalysisProps) {
  return (
    <Card sx={{ 
      flex: 1, 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          mb={3} 
          color={currentColors.textPrimary}
          fontSize={isMobile ? '1rem' : '1.125rem'}
        >
          Health & Risk Analysis
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 1 
          }}>
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.875rem' : '1rem'}
            >
              Subscription Health
            </Typography>
            <Chip 
              label={healthMetrics.status.toUpperCase()} 
              size="small"
              sx={{
                background: alpha(
                  healthMetrics.status === 'healthy' 
                    ? googleColors.green
                    : healthMetrics.status === 'warning'
                    ? googleColors.yellow
                    : googleColors.red,
                  0.1
                ),
                color: healthMetrics.status === 'healthy'
                  ? googleColors.green
                  : healthMetrics.status === 'warning'
                  ? googleColors.yellow
                  : googleColors.red,
                border: `1px solid ${alpha(
                  healthMetrics.status === 'healthy'
                    ? googleColors.green
                    : healthMetrics.status === 'warning'
                    ? googleColors.yellow
                    : googleColors.red,
                  0.3
                )}`,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={healthMetrics.score}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: currentColors.chipBackground,
              '& .MuiLinearProgress-bar': {
                background: healthMetrics.score > 70
                  ? googleColors.green
                  : healthMetrics.score > 40
                  ? googleColors.yellow
                  : googleColors.red,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: currentColors.border 
        }} />
        
        {/* Insights Section */}
        <Typography 
          variant="subtitle2" 
          fontWeight="medium" 
          gutterBottom 
          color={currentColors.textPrimary}
          fontSize={isMobile ? '0.875rem' : '1rem'}
        >
          Quick Insights
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {healthMetrics.issues?.length > 0 ? (
            healthMetrics.issues.map((issue: string, index: number) => (
              <Paper key={index} sx={{ 
                p: 1.5, 
                background: alpha(googleColors.yellow, 0.1),
                border: `1px solid ${alpha(googleColors.yellow, 0.2)}`,
                borderRadius: '8px',
              }}>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  color={currentColors.textPrimary}
                  fontSize={isMobile ? '0.75rem' : '0.875rem'}
                >
                  {issue}
                </Typography>
              </Paper>
            ))
          ) : (
            <Paper sx={{ 
              p: 1.5, 
              background: alpha(googleColors.green, 0.1),
              border: `1px solid ${alpha(googleColors.green, 0.2)}`,
              borderRadius: '8px',
            }}>
              <Typography 
                variant="caption" 
                fontWeight="medium" 
                color={currentColors.textPrimary}
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Your subscription is healthy. No issues detected.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Recommendations */}
        {healthMetrics.recommendations?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight="medium" 
              gutterBottom 
              color={currentColors.textPrimary}
              fontSize={isMobile ? '0.875rem' : '1rem'}
            >
              Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {healthMetrics.recommendations.map((rec: string, index: number) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1 
                }}>
                  <CheckCircle sx={{ 
                    color: googleColors.green, 
                    fontSize: 16,
                    mt: 0.25
                  }} />
                  <Typography 
                    variant="caption" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    {rec}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}