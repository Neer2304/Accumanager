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
  Paper,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AutoAwesome,
  Insights,
  Psychology,
  Lightbulb,
  Download,
  Refresh,
  Settings,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Email,
  Notifications,
  Warning,
  CheckCircle,
  Error,
  DataObject,
  Dashboard,
  Analytics,
  PlayArrow,
  Pause,
  Save,
  Share,
  MoreVert,
} from '@mui/icons-material'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { toast } from 'react-toastify'

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
  
  async generateReport(type: string) {
    const response = await fetch('/api/advance/ai-analytics/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportType: type })
    })
    return response.json()
  },
  
  async trainModel(dataType: string) {
    const response = await fetch('/api/advance/ai-analytics/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataType })
    })
    return response.json()
  }
}

// Types
interface Prediction {
  id: string
  metric: string
  value: number
  trend: 'up' | 'down'
  confidence: number
  description: string
  impact: 'high' | 'medium' | 'low'
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

interface ChartData {
  name: string
  value: number
  prediction?: number
}

export default function AIAnalyticsPage() {
  const { currentScheme } = useAdvanceThemeContext()
  const [tabValue, setTabValue] = useState(0)
  const [confidence, setConfidence] = useState(75)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [modelStatus, setModelStatus] = useState<'idle' | 'training' | 'ready'>('ready')
  const [openSettings, setOpenSettings] = useState(false)
  const [aiConfig, setAiConfig] = useState({
    enablePredictions: true,
    enableAnomalyDetection: true,
    alertThreshold: 80,
    dataRetention: '30d'
  })

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [predsData, insightsData] = await Promise.all([
        AIService.getPredictions(timeRange),
        AIService.getInsights()
      ])
      
      if (predsData.success) setPredictions(predsData.predictions)
      if (insightsData.success) setInsights(insightsData.insights)
      
      // Generate mock chart data
      const mockData = Array.from({ length: 12 }, (_, i) => ({
        name: `Week ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 20,
        prediction: Math.floor(Math.random() * 100) + 15
      }))
      setChartData(mockData)
      
    } catch (error) {
      toast.error('Failed to load AI analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [timeRange, autoRefresh])

  const handleGenerateReport = async (type: string) => {
    try {
      const result = await AIService.generateReport(type)
      if (result.success) {
        toast.success(`${type} report generated successfully`)
        // Trigger download
        window.open(result.downloadUrl, '_blank')
      }
    } catch (error) {
      toast.error('Failed to generate report')
    }
  }

  const handleTrainModel = async () => {
    try {
      setModelStatus('training')
      const result = await AIService.trainModel('all')
      if (result.success) {
        toast.success('AI model trained successfully')
        setModelStatus('ready')
        fetchData()
      }
    } catch (error) {
      toast.error('Model training failed')
      setModelStatus('idle')
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return currentScheme.colors.buttons.error
      case 'medium': return currentScheme.colors.buttons.warning
      case 'low': return currentScheme.colors.buttons.success
      default: return currentScheme.colors.text.secondary
    }
  }

  const renderPredictionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={currentScheme.colors.components.border} />
        <XAxis dataKey="name" stroke={currentScheme.colors.text.secondary} />
        <YAxis stroke={currentScheme.colors.text.secondary} />
        <RechartsTooltip 
          contentStyle={{ 
            background: currentScheme.colors.components.card,
            border: `1px solid ${currentScheme.colors.components.border}`,
            color: currentScheme.colors.text.primary
          }}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={currentScheme.colors.primary} 
          fill={`${currentScheme.colors.primary}20`}
          name="Actual"
        />
        <Area 
          type="monotone" 
          dataKey="prediction" 
          stroke={currentScheme.colors.secondary} 
          fill={`${currentScheme.colors.secondary}20`}
          name="Predicted"
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  )

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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
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
                  Real-time predictions, smart insights, and actionable recommendations powered by machine learning
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Chip 
                label={modelStatus === 'ready' ? 'Model Ready' : 'Training...'} 
                color={modelStatus === 'ready' ? 'success' : 'warning'}
                size="small"
                icon={modelStatus === 'ready' ? <CheckCircle /> : <CircularProgress size={16} />}
              />
              <Chip 
                label={`${predictions.length} Predictions`} 
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color={currentScheme.colors.text.secondary} variant="body2">
                    Prediction Accuracy
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    92.4%
                  </Typography>
                </Box>
                <Box sx={{ color: currentScheme.colors.buttons.success }}>
                  <TrendingUp fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color={currentScheme.colors.text.secondary} variant="body2">
                    Active Insights
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {insights.length}
                  </Typography>
                </Box>
                <Box sx={{ color: currentScheme.colors.primary }}>
                  <Insights fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color={currentScheme.colors.text.secondary} variant="body2">
                    Anomalies Detected
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    3
                  </Typography>
                </Box>
                <Box sx={{ color: currentScheme.colors.buttons.error }}>
                  <Warning fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color={currentScheme.colors.text.secondary} variant="body2">
                    Model Confidence
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {confidence}%
                  </Typography>
                </Box>
                <Box sx={{ color: currentScheme.colors.secondary }}>
                  <AutoAwesome fontSize="large" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Card sx={{ mb: 4, background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
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
                  <MenuItem value="90d">Last 90 days</MenuItem>
                  <MenuItem value="1y">Last year</MenuItem>
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
                  startIcon={modelStatus === 'training' ? <Pause /> : <PlayArrow />}
                  onClick={handleTrainModel}
                  disabled={modelStatus === 'training'}
                >
                  {modelStatus === 'training' ? 'Training...' : 'Train Model'}
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleGenerateReport('pdf')}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Settings />}
                  onClick={() => setOpenSettings(true)}
                  sx={{
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                  }}
                >
                  AI Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: currentScheme.colors.components.border, mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Predictions" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Insights" icon={<Insights />} iconPosition="start" />
          <Tab label="Visualizations" icon={<ShowChart />} iconPosition="start" />
          <Tab label="Alerts" icon={<Notifications />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Prediction Chart */}
          <Grid item xs={12}>
            <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Prediction Trends
                  </Typography>
                  <Chip
                    icon={<AutoAwesome />}
                    label="Real-time"
                    size="small"
                    sx={{
                      background: `${currentScheme.colors.primary}20`,
                      color: currentScheme.colors.primary,
                    }}
                  />
                </Box>
                {renderPredictionChart()}
              </CardContent>
            </Card>
          </Grid>

          {/* Individual Predictions */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {predictions.map((prediction) => (
                <Grid item xs={12} sm={6} md={3} key={prediction.id}>
                  <Card sx={{ 
                    background: currentScheme.colors.components.card, 
                    border: `1px solid ${currentScheme.colors.components.border}`,
                    height: '100%'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color={currentScheme.colors.text.secondary}>
                          {prediction.metric}
                        </Typography>
                        <Chip 
                          label={prediction.impact} 
                          size="small" 
                          sx={{ 
                            background: `${getImpactColor(prediction.impact)}20`,
                            color: getImpactColor(prediction.impact)
                          }}
                        />
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Typography variant="h5" fontWeight="bold">
                          {prediction.value}%
                        </Typography>
                        {prediction.trend === 'up' ? (
                          <TrendingUp sx={{ color: currentScheme.colors.buttons.success }} />
                        ) : (
                          <TrendingDown sx={{ color: currentScheme.colors.buttons.error }} />
                        )}
                      </Box>
                      
                      <LinearProgress
                        variant="determinate"
                        value={prediction.confidence}
                        sx={{
                          height: 8,
                          borderRadius: 4,
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
                      
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.8rem' }}>
                        {prediction.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {insights.map((insight) => (
            <Grid item xs={12} md={6} key={insight.id}>
              <Card sx={{ 
                background: currentScheme.colors.components.card, 
                border: `1px solid ${currentScheme.colors.components.border}`,
                height: '100%'
              }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
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
                      
                      <Chip 
                        label={insight.category} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={`${insight.confidence}% confidence`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
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
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                    <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </Typography>
                    <Button size="small" endIcon={<PlayArrow />}>
                      Implement
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Multi-dimensional Analysis</Typography>
                {renderPredictionChart()}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Data Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'High Risk', value: 25, color: currentScheme.colors.buttons.error },
                        { name: 'Medium', value: 35, color: currentScheme.colors.buttons.warning },
                        { name: 'Low', value: 40, color: currentScheme.colors.buttons.success }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { color: currentScheme.colors.buttons.error },
                        { color: currentScheme.colors.buttons.warning },
                        { color: currentScheme.colors.buttons.success }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Card sx={{ background: currentScheme.colors.components.card, border: `1px solid ${currentScheme.colors.components.border}` }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>AI Alerts & Anomalies</Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Unusual spike in churn rate detected - 40% higher than predicted
            </Alert>
            <Alert severity="info" sx={{ mb: 2 }}>
              New pattern detected: Customer satisfaction drops on weekend orders
            </Alert>
            <Alert severity="success">
              Revenue prediction accuracy improved to 95.2% after model retraining
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={openSettings} onClose={() => setOpenSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AI Model Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={aiConfig.enablePredictions}
                  onChange={(e) => setAiConfig({...aiConfig, enablePredictions: e.target.checked})}
                />
              }
              label="Enable Real-time Predictions"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={aiConfig.enableAnomalyDetection}
                  onChange={(e) => setAiConfig({...aiConfig, enableAnomalyDetection: e.target.checked})}
                />
              }
              label="Enable Anomaly Detection"
              sx={{ mb: 2, display: 'block' }}
            />
            
            <Typography variant="body2" gutterBottom sx={{ mt: 3 }}>
              Alert Threshold
            </Typography>
            <Slider
              value={aiConfig.alertThreshold}
              onChange={(_, value) => setAiConfig({...aiConfig, alertThreshold: value as number})}
              min={50}
              max={95}
              valueLabelDisplay="auto"
            />
            
            <Typography variant="body2" gutterBottom sx={{ mt: 3 }}>
              Data Retention Period
            </Typography>
            <Select
              fullWidth
              value={aiConfig.dataRetention}
              onChange={(e) => setAiConfig({...aiConfig, dataRetention: e.target.value})}
              size="small"
            >
              <MenuItem value="7d">7 days</MenuItem>
              <MenuItem value="30d">30 days</MenuItem>
              <MenuItem value="90d">90 days</MenuItem>
              <MenuItem value="1y">1 year</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setOpenSettings(false)
              toast.success('AI settings updated')
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}