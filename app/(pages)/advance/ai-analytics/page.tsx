// app/(pages)/advance/ai-analytics/page.tsx - SIMPLIFIED VERSION
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
  Paper,
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
import { toast } from 'react-toastify'
import AIWelcomeDialog from '@/components/advance/AIWelcomeDialog'

// API service
const AIService = {
  async getPredictions(timeRange: string) {
    const response = await fetch(`/api/advance/ai-analytics/predictions?range=${timeRange}`)
    return response.json()
  },

  async getInsights() {
    const response = await fetch('/api/advance/ai-analytics/insights')
    return response.json()
  },
}

// Types
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
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)
  const [confidence, setConfidence] = useState(85)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [openSettings, setOpenSettings] = useState(false)
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Chart data
  const [chartData] = useState([
    { month: 'Jan', revenue: 2400000, forecast: 2200000 },
    { month: 'Feb', revenue: 3200000, forecast: 3000000 },
    { month: 'Mar', revenue: 2800000, forecast: 2900000 },
    { month: 'Apr', revenue: 4100000, forecast: 3800000 },
    { month: 'May', revenue: 3800000, forecast: 4000000 },
    { month: 'Jun', revenue: 4500000, forecast: 4200000 },
  ])

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
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
        ]
        
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
        ]
        
        setPredictions(mockPredictions)
        setInsights(mockInsights)
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      toast.error('Failed to load AI analytics data')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAIQuery = async () => {
    if (!query.trim()) return
    
    setIsAnalyzing(true)
    setTimeout(() => {
      const responses = [
        "Based on current trends, focusing on customer retention could improve revenue by 15-20%.",
        "Revenue forecast shows 68% growth potential. Consider marketing investments during peak seasons.",
        "Operational efficiency is below target. Process optimization could save ₹2.5M annually.",
      ]
      setAiResponse(responses[Math.floor(Math.random() * responses.length)])
      setIsAnalyzing(false)
    }, 1000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return currentScheme.colors.buttons.error
      case 'medium': return currentScheme.colors.buttons.warning
      case 'low': return currentScheme.colors.buttons.success
      default: return currentScheme.colors.text.secondary
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Box textAlign="center">
          <CircularProgress sx={{ color: currentScheme.colors.primary, mb: 2 }} />
          <Typography color={currentScheme.colors.text.secondary}>
            Loading AI insights...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* REMOVED: AIWelcomeDialog is already in layout.tsx */}
      
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Psychology sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🤖 AI Analytics Dashboard
            </Typography>
            <Typography variant="body1" color={currentScheme.colors.text.secondary}>
              Real-time predictions, smart insights, and actionable recommendations
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: '200px', background: currentScheme.colors.components.card }}>
            <CardContent sx={{ p: 2 }}>
              <Typography color={currentScheme.colors.text.secondary} variant="body2">
                Prediction Accuracy
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                94.7%
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: '200px', background: currentScheme.colors.components.card }}>
            <CardContent sx={{ p: 2 }}>
              <Typography color={currentScheme.colors.text.secondary} variant="body2">
                Active Insights
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {insights.length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: '200px', background: currentScheme.colors.components.card }}>
            <CardContent sx={{ p: 2 }}>
              <Typography color={currentScheme.colors.text.secondary} variant="body2">
                AI Confidence
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {confidence}%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* AI Query Section */}
      <Card sx={{ mb: 4, background: currentScheme.colors.components.card }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Ask AI Anything
            </Typography>
            <Chip label="Beta" size="small" color="primary" />
          </Box>
          
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Example: Predict next quarter revenue, analyze customer churn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Psychology sx={{ color: currentScheme.colors.primary }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleAIQuery}
              disabled={isAnalyzing}
              sx={{
                background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                minWidth: 120
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
                sx={{ mt: 2, background: `${currentScheme.colors.primary}10` }}
              >
                <Typography variant="body2">{aiResponse}</Typography>
              </Alert>
            </Fade>
          )}

          <Box display="flex" gap={1} mt={2} flexWrap="wrap">
            <Chip
              label="Revenue trends"
              size="small"
              onClick={() => setQuery("Show revenue trends")}
            />
            <Chip
              label="Customer analysis"
              size="small"
              onClick={() => setQuery("Analyze customer behavior")}
            />
            <Chip
              label="Sales predictions"
              size="small"
              onClick={() => setQuery("Predict next month sales")}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card sx={{ mb: 4, background: currentScheme.colors.components.card }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
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
              label="Auto-refresh"
            />
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchData}
              disabled={loading}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ModelTraining />}
              onClick={() => toast.info('Training AI models...')}
            >
              Train AI
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: currentScheme.colors.components.border }}
      >
        <Tab label="Predictions" icon={<AutoAwesome />} iconPosition="start" />
        <Tab label="Insights" icon={<Insights />} iconPosition="start" />
        <Tab label="Analytics" icon={<ShowChart />} iconPosition="start" />
      </Tabs>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Predictions Cards */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {predictions.map((prediction) => (
              <Card 
                key={prediction.id} 
                sx={{ 
                  flex: '1 1 250px',
                  minWidth: '250px',
                  background: currentScheme.colors.components.card,
                  border: `1px solid ${currentScheme.colors.components.border}`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2,
                      background: `${getImpactColor(prediction.impact)}20`,
                      color: getImpactColor(prediction.impact)
                    }}>
                      {prediction.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {prediction.metric}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                      {prediction.value}%
                    </Typography>
                    <Box sx={{ 
                      color: prediction.trend === 'up' 
                        ? currentScheme.colors.buttons.success 
                        : prediction.trend === 'down'
                        ? currentScheme.colors.buttons.error
                        : currentScheme.colors.buttons.warning
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
                      background: currentScheme.colors.components.border,
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                      },
                    }}
                  />

                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    AI Confidence: {prediction.confidence}%
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Chart */}
          <Card sx={{ background: currentScheme.colors.components.card }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Revenue Forecast vs Actual
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentScheme.colors.components.border} />
                    <XAxis dataKey="month" stroke={currentScheme.colors.text.secondary} />
                    <YAxis stroke={currentScheme.colors.text.secondary} />
                    {/* <RechartsTooltip /> */}
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={currentScheme.colors.primary} 
                      fill={`${currentScheme.colors.primary}20`}
                      name="Actual Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke={currentScheme.colors.secondary} 
                      fill={`${currentScheme.colors.secondary}20`}
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
            <Card key={insight.id} sx={{ background: currentScheme.colors.components.card }}>
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box sx={{ color: currentScheme.colors.primary, mt: 0.5 }}>
                    <Lightbulb />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" color={currentScheme.colors.text.secondary} gutterBottom>
                      {insight.description}
                    </Typography>
                    
                    <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                      <Chip label={insight.category} size="small" />
                      <Chip 
                        label={`${insight.confidence}% confidence`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Actions:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {insight.actionItems.map((action, idx) => (
                        <Box component="li" key={idx} sx={{ typography: 'body2', mb: 0.5 }}>
                          {action}
                        </Box>
                      ))}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </Typography>
                      <Button size="small" variant="outlined">
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
        <Card sx={{ background: currentScheme.colors.components.card }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 AI Confidence Settings
            </Typography>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" gutterBottom>
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
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                Higher confidence = More accurate but fewer predictions
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Model Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={true}
                  onChange={() => {}}
                />
              }
              label="Enable Real-time Predictions"
              sx={{ mb: 2, display: "block" }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={true}
                  onChange={() => {}}
                />
              }
              label="Enable Anomaly Detection"
              sx={{ mb: 2, display: "block" }}
            />

            <Typography variant="body2" gutterBottom sx={{ mt: 3 }}>
              Alert Threshold
            </Typography>
            <Slider
              value={80}
              onChange={() => {}}
              min={50}
              max={95}
              valueLabelDisplay="auto"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenSettings(false);
              toast.success("AI settings updated");
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}