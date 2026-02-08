// app/(pages)/advance/ai-analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Slider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  InputAdornment,
  Divider,
  alpha,
  useMediaQuery,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  AutoAwesome,
  Insights,
  Psychology,
  Lightbulb,
  Download,
  Refresh,
  Settings,
  ShowChart,
  Notifications,
  Warning,
  CheckCircle,
  PlayArrow,
  ModelTraining,
  Send,
  CrisisAlert,
  CurrencyExchange,
  SentimentSatisfiedAlt,
  PrecisionManufacturing,
  Leaderboard,
  RocketLaunch,
  Info,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'

// Google colors
const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
  
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    card: '#FFFFFF',
    chipBackground: '#F1F3F4',
    header: '#FFFFFF',
    sidebar: '#FFFFFF',
    hover: '#F8F9FA',
    active: '#E8F0FE',
  },
  
  dark: {
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    card: '#303134',
    chipBackground: '#3C4043',
    header: '#303134',
    sidebar: '#202124',
    hover: '#3C4043',
    active: '#5F6368',
  }
};

interface Prediction {
  id: string
  metric: string
  value: number
  trend: 'up' | 'down' | 'stable'
  confidence: number
  description: string
  impact: 'high' | 'medium' | 'low'
  icon: any
}

interface Insight {
  id: string
  title: string
  description: string
  category: string
  confidence: number
  actionItems: string[]
  timestamp: string
}

export default function AIAnalyticsPage() {
  const { mode } = useAdvanceThemeContext();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const [tabValue, setTabValue] = useState(0);
  const [confidence, setConfidence] = useState(85);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [openSettings, setOpenSettings] = useState(false);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentColors = mode === 'dark' ? googleColors.dark : googleColors.light;
  const primaryColor = googleColors.blue;

  // Chart data
  const [chartData] = useState([
    { month: 'Jan', revenue: 2400000, forecast: 2200000 },
    { month: 'Feb', revenue: 3200000, forecast: 3000000 },
    { month: 'Mar', revenue: 2800000, forecast: 2900000 },
    { month: 'Apr', revenue: 4100000, forecast: 3800000 },
    { month: 'May', revenue: 3800000, forecast: 4000000 },
    { month: 'Jun', revenue: 4500000, forecast: 4200000 },
  ]);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockPredictions: Prediction[] = [
          {
            id: '1',
            metric: 'Customer Churn Risk',
            value: 24,
            trend: 'up',
            confidence: 92,
            description: 'Based on engagement patterns',
            impact: 'high',
            icon: <CrisisAlert />
          },
          {
            id: '2',
            metric: 'Revenue Forecast',
            value: 68,
            trend: 'up',
            confidence: 95,
            description: 'Projected growth',
            impact: 'high',
            icon: <CurrencyExchange />
          },
          {
            id: '3',
            metric: 'Customer Satisfaction',
            value: 82,
            trend: 'stable',
            confidence: 88,
            description: 'Based on feedback',
            impact: 'medium',
            icon: <SentimentSatisfiedAlt />
          },
          {
            id: '4',
            metric: 'Operational Efficiency',
            value: 45,
            trend: 'down',
            confidence: 76,
            description: 'Process bottlenecks',
            impact: 'medium',
            icon: <PrecisionManufacturing />
          },
        ];
        
        const mockInsights: Insight[] = [
          {
            id: '1',
            title: 'Weekend shipping delays detected',
            description: 'Tickets increased by 150% on weekends due to reduced staffing',
            category: 'Operations',
            confidence: 94,
            actionItems: [
              'Increase weekend warehouse staff',
              'Implement delay notifications',
              'Review shipping partners'
            ],
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Optimal discount range identified',
            description: '12-18% discounts maximize conversion and revenue',
            category: 'Pricing',
            confidence: 89,
            actionItems: [
              'Adjust promotional discounts',
              'Test tiered pricing',
              'Monitor revenue impact'
            ],
            timestamp: new Date().toISOString(),
          },
        ];
        
        setPredictions(mockPredictions);
        setInsights(mockInsights);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to load AI analytics data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAIQuery = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const responses = [
        "Based on current trends, focusing on customer retention could improve revenue by 15-20%.",
        "Revenue forecast shows 68% growth potential. Consider marketing investments during peak seasons.",
        "Operational efficiency is below target. Process optimization could save ₹2.5M annually.",
      ];
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return googleColors.red;
      case 'medium': return googleColors.yellow;
      case 'low': return googleColors.green;
      default: return currentColors.textSecondary;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        backgroundColor: currentColors.background,
      }}>
        <Box textAlign="center">
          <CircularProgress sx={{ color: primaryColor, mb: 2 }} />
          <Typography color={currentColors.textSecondary}>
            Loading AI insights...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 2,
      backgroundColor: currentColors.background,
      minHeight: '100vh',
      color: currentColors.textPrimary,
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Box display="flex" alignItems="center" gap={isMobile ? 1 : 3} mb={2}>
          <Box
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: isMobile ? 2 : 3,
              background: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(66,133,244,0.4)',
            }}
          >
            <Psychology sx={{ 
              fontSize: isMobile ? 24 : 32, 
              color: 'white' 
            }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold"
              fontSize={isMobile ? '1.25rem' : '1.5rem'}
              gutterBottom
            >
              🤖 AI Analytics Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              color={currentColors.textSecondary}
              fontSize={isMobile ? '0.875rem' : '1rem'}
            >
              Real-time predictions, smart insights, and actionable recommendations
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap' 
        }}>
          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography 
                color={currentColors.textSecondary} 
                variant="body2"
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Prediction Accuracy
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                94.7%
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography 
                color={currentColors.textSecondary} 
                variant="body2"
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                Active Insights
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                {insights.length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ 
            flex: isMobile ? '1 1 100%' : '1 1 calc(33.333% - 16px)',
            minWidth: isMobile ? '100%' : '200px',
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography 
                color={currentColors.textSecondary} 
                variant="body2"
                fontSize={isMobile ? '0.75rem' : '0.875rem'}
              >
                AI Confidence
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                fontSize={isMobile ? '1.25rem' : '1.5rem'}
              >
                {confidence}%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* AI Query Section */}
      <Card sx={{ 
        mb: 3, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              fontSize={isMobile ? '1rem' : '1.125rem'}
            >
              Ask AI Anything
            </Typography>
            <Chip 
              label="Beta" 
              size="small" 
              sx={{
                backgroundColor: alpha(googleColors.yellow, 0.1),
                color: googleColors.yellow,
                border: `1px solid ${alpha(googleColors.yellow, 0.3)}`,
                fontWeight: 500,
              }}
            />
          </Box>
          
          <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
            <TextField
              fullWidth
              placeholder="Example: Predict next quarter revenue, analyze customer churn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Psychology sx={{ color: primaryColor }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: currentColors.textPrimary,
                  '& fieldset': {
                    borderColor: currentColors.border,
                  },
                  '&:hover fieldset': {
                    borderColor: primaryColor,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAIQuery}
              disabled={isAnalyzing}
              sx={{
                background: primaryColor,
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                minWidth: isMobile ? '100%' : 120,
                '&:hover': {
                  background: '#3367D6',
                },
              }}
            >
              {isAnalyzing ? <CircularProgress size={24} /> : 'Ask AI'}
            </Button>
          </Box>

          {aiResponse && (
            <Fade in={!!aiResponse}>
              <Alert 
                severity="info" 
                icon={<Info />}
                sx={{ 
                  mt: 2, 
                  background: alpha(primaryColor, 0.1),
                  border: `1px solid ${alpha(primaryColor, 0.3)}`,
                }}
              >
                <Typography variant="body2" fontSize={isMobile ? '0.875rem' : '1rem'}>
                  {aiResponse}
                </Typography>
              </Alert>
            </Fade>
          )}

          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            <Chip
              label="Revenue trends"
              size="small"
              onClick={() => setQuery("Show revenue trends")}
              sx={{
                border: `1px solid ${currentColors.border}`,
              }}
            />
            <Chip
              label="Customer analysis"
              size="small"
              onClick={() => setQuery("Analyze customer behavior")}
              sx={{
                border: `1px solid ${currentColors.border}`,
              }}
            />
            <Chip
              label="Sales predictions"
              size="small"
              onClick={() => setQuery("Predict next month sales")}
              sx={{
                border: `1px solid ${currentColors.border}`,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card sx={{ 
        mb: 3, 
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2} 
            flexWrap="wrap"
            justifyContent={isMobile ? "center" : "flex-start"}
          >
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                minWidth: isMobile ? 120 : 140,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border,
                },
              }}
            >
              <MenuItem value="24h">Last 24 hours</MenuItem>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last quarter</MenuItem>
            </Select>
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="primary"
                />
              }
              label={isMobile ? "Auto" : "Auto-refresh"}
              sx={{ m: 0 }}
            />
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchData}
              disabled={loading}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: alpha(primaryColor, 0.04),
                }
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ModelTraining />}
              onClick={() => console.log('Training AI models...')}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: alpha(primaryColor, 0.04),
                }
              }}
            >
              {isMobile ? 'Train' : 'Train AI'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ 
          mb: 3, 
          borderBottom: 1, 
          borderColor: currentColors.border,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: isMobile ? '0.875rem' : '1rem',
            minHeight: isMobile ? 48 : 56,
          }
        }}
      >
        <Tab 
          label="Predictions" 
          icon={<AutoAwesome />} 
          iconPosition="start" 
          sx={{ minWidth: isMobile ? 100 : 120 }}
        />
        <Tab 
          label="Insights" 
          icon={<Insights />} 
          iconPosition="start" 
          sx={{ minWidth: isMobile ? 100 : 120 }}
        />
        <Tab 
          label="Analytics" 
          icon={<ShowChart />} 
          iconPosition="start" 
          sx={{ minWidth: isMobile ? 100 : 120 }}
        />
      </Tabs>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Predictions Cards */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {predictions.map((prediction) => (
              <Card 
                key={prediction.id} 
                sx={{ 
                  flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 12px)',
                  minWidth: isMobile ? '100%' : '300px',
                  background: currentColors.card,
                  border: `1px solid ${currentColors.border}`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2,
                      background: alpha(getImpactColor(prediction.impact), 0.1),
                      color: getImpactColor(prediction.impact)
                    }}>
                      {prediction.icon}
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        fontSize={isMobile ? '0.875rem' : '1rem'}
                      >
                        {prediction.metric}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      fontSize={isMobile ? '1.25rem' : '1.5rem'}
                    >
                      {prediction.value}%
                    </Typography>
                    <Box sx={{ 
                      color: prediction.trend === 'up' 
                        ? googleColors.green 
                        : prediction.trend === 'down'
                        ? googleColors.red
                        : googleColors.yellow
                    }}>
                      {prediction.trend === 'up' ? <TrendingUp /> : 
                       prediction.trend === 'down' ? <TrendingDown /> : 
                       <TrendingFlat />}
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={prediction.confidence}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 1,
                      backgroundColor: currentColors.chipBackground,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: primaryColor,
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Typography 
                    variant="caption" 
                    color={currentColors.textSecondary}
                    fontSize={isMobile ? '0.75rem' : '0.875rem'}
                  >
                    AI Confidence: {prediction.confidence}%
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Chart */}
          <Card sx={{ 
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                fontSize={isMobile ? '1rem' : '1.125rem'}
              >
                📈 Revenue Forecast vs Actual
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentColors.border} />
                    <XAxis 
                      dataKey="month" 
                      stroke={currentColors.textSecondary}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <YAxis 
                      stroke={currentColors.textSecondary}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={primaryColor} 
                      fill={alpha(primaryColor, 0.2)}
                      name="Actual Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke={googleColors.green} 
                      fill={alpha(googleColors.green, 0.2)}
                      name="AI Forecast"
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {insights.map((insight) => (
            <Card 
              key={insight.id} 
              sx={{ 
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box sx={{ 
                    color: primaryColor, 
                    mt: 0.5,
                    fontSize: isMobile ? 20 : 24 
                  }}>
                    <Lightbulb fontSize={isMobile ? "small" : "medium"} />
                  </Box>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      fontWeight="medium" 
                      gutterBottom
                      fontSize={isMobile ? '1rem' : '1.125rem'}
                    >
                      {insight.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={currentColors.textSecondary} 
                      gutterBottom
                      fontSize={isMobile ? '0.875rem' : '1rem'}
                    >
                      {insight.description}
                    </Typography>
                    
                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip 
                        label={insight.category} 
                        size="small" 
                        sx={{
                          backgroundColor: alpha(primaryColor, 0.1),
                          color: primaryColor,
                          border: `1px solid ${alpha(primaryColor, 0.3)}`,
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                        }}
                      />
                      <Chip 
                        label={`${insight.confidence}% confidence`} 
                        size="small" 
                        variant="outlined"
                        sx={{
                          border: `1px solid ${currentColors.border}`,
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                        }}
                      />
                    </Box>

                    <Typography 
                      variant="subtitle2" 
                      gutterBottom
                      fontSize={isMobile ? '0.875rem' : '1rem'}
                      fontWeight="medium"
                    >
                      Recommended Actions:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {insight.actionItems.map((action, idx) => (
                        <Box 
                          component="li" 
                          key={idx} 
                          sx={{ 
                            typography: 'body2', 
                            mb: 0.5,
                            fontSize: isMobile ? '0.875rem' : '1rem'
                          }}
                        >
                          {action}
                        </Box>
                      ))}
                    </Box>

                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      mt={2}
                      flexDirection={isMobile ? "column" : "row"}
                      gap={isMobile ? 1 : 0}
                    >
                      <Typography 
                        variant="caption" 
                        color={currentColors.textSecondary}
                        fontSize={isMobile ? '0.75rem' : '0.875rem'}
                      >
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined"
                        sx={{
                          border: `1px solid ${currentColors.border}`,
                          color: currentColors.textPrimary,
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          '&:hover': {
                            borderColor: primaryColor,
                            backgroundColor: alpha(primaryColor, 0.04),
                          }
                        }}
                      >
                        Implement
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {tabValue === 2 && (
        <Card sx={{ 
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              fontSize={isMobile ? '1rem' : '1.125rem'}
            >
              🎯 AI Confidence Settings
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography 
                variant="body2" 
                gutterBottom
                fontSize={isMobile ? '0.875rem' : '1rem'}
              >
                Adjust AI confidence threshold
              </Typography>
              <Slider
                value={confidence}
                onChange={(_, value) => setConfidence(value as number)}
                min={50}
                max={95}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 95, label: '95%' },
                ]}
                sx={{
                  color: primaryColor,
                }}
              />
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2, 
                  background: alpha(primaryColor, 0.1),
                  border: `1px solid ${alpha(primaryColor, 0.3)}`,
                }}
              >
                <Typography variant="body2" fontSize={isMobile ? '0.875rem' : '1rem'}>
                  Higher confidence = More accurate but fewer predictions
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}