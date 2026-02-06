// @/components/advance/AIAssistant.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  Grow,
  Tooltip,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  SmartToy,
  Send,
  Close,
  Mic,
  MicOff,
  AttachFile,
  Image,
  DataObject,
  Code,
  Psychology,
  AutoAwesome,
  Refresh,
  Delete,
  Download,
  Share,
  MoreVert,
  ChatBubbleOutline,
  Analytics,
  TrendingUp,
  BarChart,
  PieChart,
  Timeline,
  ShowChart,
  QueryStats,
  Insights,
  Lightbulb,
  Warning,
  CheckCircle,
  Error,
  Help,
  Settings,
  History,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  ContentCopy,
  ExpandMore,
  ExpandLess,
  KeyboardVoice,
  VolumeUp,
  VolumeOff,
  Translate,
  FormatQuote,
  TableChart,
  Functions,
  Calculate,
  Sort,
  FilterList,
  Search,
  Dashboard,
  GridView,
  ViewList,
  ViewModule,
  Category,
  Tag,
  Label,
  LocalOffer,
  Bookmark,
  BookmarkBorder,
  Flag,
  Report,
  Block,
  Archive,
  Unarchive,
  MarkAsUnread,
  MarkEmailRead,
  Notifications,
  NotificationsOff,
  DoNotDisturb,
  DoNotDisturbOff,
  Snooze,
  Schedule,
  CalendarToday,
  AccessTime,
  Timer,
  HourglassEmpty,
  HourglassFull,
  Speed,
  FlashOn,
  Bolt,
  Rocket,
  RocketLaunch,
  Satellite,
  SatelliteAlt,
  Public,
  Language,
  Map,
  LocationOn,
  Navigation,
  Explore,
  TravelExplore,
  Streetview,
  Terrain,
  Layers,
  FilterCenterFocus,
  ZoomIn,
  ZoomOut,
  Crop,
  RotateLeft,
  RotateRight,
  Flip,
  AspectRatio,
  Transform,
  ScatterPlot,
  BubbleChart,
  DonutLarge,
  DonutSmall,
  PieChartOutlined,
  MultilineChart,
  StackedLineChart,
  AreaChart,
  ShowChartOutlined,
  TimelineOutlined,
  TrendingFlat,
  TrendingDown,
  TrendingUpOutlined,
  Money,
  CurrencyExchange,
  CurrencyRupee,
  AttachMoney,
  MonetizationOn,
  Paid,
  RequestQuote,
  AccountBalance,
  AccountBalanceWallet,
  Savings,
  CreditCard,
  Receipt,
  ReceiptLong,
  Description,
  Article,
  DocumentScanner,
  PictureAsPdf,
  InsertDriveFile,
  InsertPhoto,
  InsertChart,
  InsertChartOutlined,
  InsertComment,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatColorText,
  FormatPaint,
  Brush,
  Palette,
  ColorLens,
  Gradient,
  Opacity,
  InvertColors,
  FormatSize,
  TextFields,
  Title,
  ShortText,
  Notes,
  Subject,
  SpaceBar,
  WrapText,
  FormatLineSpacing,
  FormatIndentIncrease,
  FormatIndentDecrease,
  FormatListBulleted,
  FormatListNumbered,
  Checklist,
  PlaylistAddCheck,
  PlaylistAdd,
  Queue,
  AddToQueue,
  RemoveFromQueue,
  FeaturedPlayList,
  ViewHeadline,
  ViewAgenda,
  ViewStream,
  ViewWeek,
  ViewModule as ViewModuleIcon,
  ViewComfy,
  ViewCompact,
  GridOn,
  GridOff,
  TableRows,
  TableChartOutlined,
  BorderAll,
  BorderClear,
  BorderTop,
  BorderBottom,
  BorderLeft,
  BorderRight,
  BorderInner,
  BorderOuter,
  BorderHorizontal,
  BorderVertical,
  BorderStyle,
  Margin,
  Padding,
  Height,
  AspectRatioOutlined,
  Crop169,
  Crop32,
  Crop54,
  Crop75,
  CropDin,
  CropFree,
  CropOriginal,
  CropPortrait,
  CropLandscape,
  CropRotate,
  CropSquare,
  Straighten,
  Filter,
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  FilterAlt,
  FilterAltOff,
  FilterBAndW,
  FilterCenterFocusOutlined,
  FilterDrama,
  FilterFrames,
  FilterHdr,
  FilterNone,
  FilterTiltShift,
  FilterVintage,
  BlurOn,
  BlurOff,
  BlurLinear,
  BlurCircular,
  Adjust,
  Tune,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  AutoAwesomeMosaic,
  AutoAwesomeMotion,
  AutoStories,
  AutoDelete,
  AutoGraph,
  AutoMode,
  AutoAwesomeOutlined,
  Security,
  Shield,
  GppGood,
  GppMaybe,
  GppBad,
  PrivacyTip,
  AdminPanelSettings,
  VerifiedUser,
  Verified,
  WorkspacePremium,
  Diamond,
  EmojiEvents,
  MilitaryTech,
  School,
  Work,
  WorkOutline,
  Business,
  BusinessCenter,
  Store,
  Storefront,
  StoreMallDirectory,
  ShoppingBag,
  ShoppingCart,
  ShoppingBasket,
  LocalMall,
  LocalGroceryStore,
  LocalConvenienceStore,
  LocalFlorist,
  LocalCafe,
  LocalBar,
  LocalPizza,
  LocalMovies,
  LocalLibrary,
  LocalHospital,
  LocalPharmacy,
  LocalTaxi,
  LocalAirport,
  LocalAtm,
  LocalCarWash,
  LocalGasStation,
  LocalHotel,
  LocalLaundryService,
  LocalParking,
  LocalPhone,
  LocalPostOffice,
  LocalShipping,
  LocalSee,
  LocalActivity,
  DirectionsCar,
  DirectionsBus,
  DirectionsBike,
  DirectionsWalk,
  DirectionsTransit,
  DirectionsBoat,
  DirectionsRailway,
  DirectionsRun,
  DirectionsSubway,
  Directions,
  NavigationOutlined,
  MyLocation,
  Place,
  WhereToVote,
  PinDrop,
  LocationSearching,
  LocationDisabled,
  LocationOff,
  LocationOnOutlined,
  MapOutlined,
  MapsHomeWork,
  AddLocation,
  AddLocationAlt,
  EditLocation,
  EditLocationAlt,
  LocationCity,
  Nature,
  NaturePeople,
  Park,
  TerrainOutlined,
  Agriculture,
  Forest,
  Grass,
  Yard,
  Water,
  Waves,
  Pool,
  BeachAccess,
  AcUnit,
  Whatshot,
  Fireplace,
  DeviceThermostat,
  InvertColorsOff,
  OpacityOutlined,
  Compress,
  Expand,
  Fullscreen,
  FullscreenExit,
  CloseFullscreen,
  OpenInFull,
  CloseFullscreenOutlined,
  CropFreeOutlined,
  ZoomInMap,
  ZoomOutMap,
  FitScreen,
  AspectRatioOutlined as AspectRatioOutlinedIcon,
  ViewInAr,
  ViewCompactOutlined,
  ViewCozy,
  ViewComfyOutlined,
  ViewCompactOutlined as ViewCompactOutlinedIcon,
  ViewModuleOutlined,
  ViewQuilt,
  ViewSidebar,
  ViewStreamOutlined,
  ViewWeekOutlined,
  Add,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdvanceThemeContext } from '@/contexts/AdvanceThemeContexts'
import { toast } from 'react-toastify'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type: 'text' | 'chart' | 'data' | 'suggestion'
  suggestions?: string[]
  chartData?: any
  loading?: boolean
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  starred: boolean
  tags: string[]
}

const AIAssistant = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { currentScheme } = useAdvanceThemeContext()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Analytics Assistant. I can help you analyze data, generate insights, create visualizations, and answer questions about your business metrics. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        "Show me revenue trends",
        "Predict customer churn",
        "Create a sales dashboard",
        "Analyze marketing performance"
      ]
    }
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv1',
      title: 'Revenue Analysis',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: true,
      tags: ['revenue', 'analysis']
    },
    {
      id: 'conv2',
      title: 'Customer Insights',
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      starred: false,
      tags: ['customer', 'retention']
    }
  ])
  const [activeConversation, setActiveConversation] = useState<string>('current')
  const [showHistory, setShowHistory] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Simulate voice recording
  useEffect(() => {
    let recognition: any = null

    if (isRecording && typeof window !== 'undefined') {
      // Initialize Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('')
          
          setInput(transcript)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error)
          setIsRecording(false)
          toast.error('Voice recognition failed')
        }

        recognition.start()
      } else {
        toast.warning('Voice recognition not supported in this browser')
        setIsRecording(false)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [isRecording])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI thinking
    const thinkingMessage: Message = {
      id: 'thinking',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      loading: true
    }

    setMessages(prev => [...prev, thinkingMessage])

    // Simulate AI response after delay
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== 'thinking'))
      
      const aiResponse = generateAIResponse(input)
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (query: string): Message => {
    const queryLower = query.toLowerCase()
    
    // Sample responses based on query
    const responses: Record<string, Message> = {
      'revenue': {
        id: Date.now().toString(),
        content: "Your revenue has grown by 24% this quarter compared to last quarter. Here's a breakdown:",
        sender: 'ai',
        timestamp: new Date(),
        type: 'chart',
        suggestions: [
          "Show monthly revenue",
          "Compare with last year",
          "Analyze by product category",
          "Export revenue report"
        ],
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            {
              label: 'Revenue (in ₹)',
              data: [2500000, 3200000, 2800000, 4100000],
              borderColor: currentScheme.colors.primary,
              backgroundColor: `${currentScheme.colors.primary}20`,
              fill: true
            }
          ]
        }
      },
      'customer': {
        id: Date.now().toString(),
        content: "You have 1,245 active customers with an average lifetime value of ₹15,200. Churn rate is 2.4% this month.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'data',
        suggestions: [
          "Segment customers by value",
          "Identify at-risk customers",
          "Create retention campaign",
          "Calculate CLV forecast"
        ]
      },
      'predict': {
        id: Date.now().toString(),
        content: "Based on current trends, I predict:\n• Next month revenue: ₹4.2M (12% growth)\n• Customer churn: 2.8%\n• New customers: 180",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          "Run detailed prediction model",
          "Compare with industry benchmarks",
          "Adjust prediction parameters",
          "Create action plan"
        ]
      },
      'dashboard': {
        id: Date.now().toString(),
        content: "I've analyzed your key metrics. Here's a recommended dashboard configuration:",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion',
        suggestions: [
          "Add revenue trend chart",
          "Include customer segmentation",
          "Show real-time sales data",
          "Add performance alerts"
        ]
      }
    }

    // Default response if no specific match
    return responses[Object.keys(responses).find(key => queryLower.includes(key)) || 'default'] || {
      id: Date.now().toString(),
      content: "I understand you're asking about: " + query + ". I can help you analyze this. Would you like me to create a visualization, run an analysis, or provide specific insights?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        "Create a chart for this data",
        "Run predictive analysis",
        "Compare with historical data",
        "Generate insights report"
      ]
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
  }

  const handleClearConversation = () => {
    setMessages([
      {
        id: '1',
        content: "Conversation cleared. How can I help you today?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          "Show me revenue trends",
          "Predict customer churn",
          "Create a sales dashboard",
          "Analyze marketing performance"
        ]
      }
    ])
    toast.success('Conversation cleared')
  }

  const handleExportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.sender === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Conversation exported')
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user'
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            mb: 2
          }}
        >
          <Box
            sx={{
              maxWidth: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isUser ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Sender info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: isUser 
                    ? currentScheme.colors.primary 
                    : currentScheme.colors.secondary
                }}
              >
                {isUser ? 'U' : <SmartToy sx={{ fontSize: 18 }} />}
              </Avatar>
              <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                {isUser ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>

            {/* Message content */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                borderTopLeftRadius: isUser ? 12 : 4,
                borderTopRightRadius: isUser ? 4 : 12,
                background: isUser
                  ? `linear-gradient(135deg, ${currentScheme.colors.primary}15 0%, ${currentScheme.colors.secondary}15 100%)`
                  : currentScheme.colors.components.card,
                border: `1px solid ${isUser ? currentScheme.colors.primary + '30' : currentScheme.colors.components.border}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {message.loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">AI is thinking...</Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>

                  {/* Chart visualization */}
                  {message.chartData && (
                    <Box sx={{ mt: 2, p: 2, background: currentScheme.colors.background, borderRadius: 2 }}>
                      <Typography variant="caption" color={currentScheme.colors.text.secondary} gutterBottom>
                        📊 Generated Visualization
                      </Typography>
                      {/* Simple chart representation */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 100, mt: 1 }}>
                        {message.chartData.datasets[0].data.map((value: number, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              flex: 1,
                              height: `${(value / 5000000) * 100}%`,
                              background: `linear-gradient(to top, ${currentScheme.colors.primary}, ${currentScheme.colors.secondary})`,
                              borderRadius: '4px 4px 0 0',
                              minHeight: 20
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        {message.chartData.labels.map((label: string, index: number) => (
                          <Typography key={index} variant="caption" color={currentScheme.colors.text.secondary}>
                            {label}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Quick actions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          onClick={() => handleQuickSuggestion(suggestion)}
                          sx={{
                            cursor: 'pointer',
                            background: `${currentScheme.colors.primary}10`,
                            color: currentScheme.colors.primary,
                            border: `1px solid ${currentScheme.colors.primary}30`,
                            '&:hover': {
                              background: `${currentScheme.colors.primary}20`,
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Box>
        </Box>
      </motion.div>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
          borderRadius: 3,
          overflow: 'hidden',
          background: currentScheme.colors.components.card,
          border: `1px solid ${currentScheme.colors.components.border}`,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 2, 
        borderBottom: `1px solid ${currentScheme.colors.components.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${currentScheme.colors.primary}05 0%, ${currentScheme.colors.secondary}05 100%)`
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar sx={{ 
              bgcolor: currentScheme.colors.primary,
              width: 40,
              height: 40
            }}>
              <SmartToy />
            </Avatar>
          </motion.div>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              🤖 AI Analytics Assistant
            </Typography>
            <Typography variant="caption" color={currentScheme.colors.text.secondary}>
              Ask me anything about your data
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); setShowHistory(!showHistory); }}>
          <History sx={{ mr: 1 }} />
          {showHistory ? 'Hide History' : 'Show History'}
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleClearConversation(); }}>
          <Delete sx={{ mr: 1 }} />
          Clear Conversation
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleExportConversation(); }}>
          <Download sx={{ mr: 1 }} />
          Export Conversation
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Settings sx={{ mr: 1 }} />
          AI Settings
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <DialogContent sx={{ 
        flex: 1, 
        p: 0,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Conversation History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                width: 250,
                height: '100%',
                borderRight: `1px solid ${currentScheme.colors.components.border}`,
                p: 2,
                overflow: 'auto'
              }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  💭 Conversation History
                </Typography>
                <List dense>
                  {/* {conversations.map((conv) => (
                    // <ListItem
                    //   key={conv.id}
                    //   button
                    //   selected={activeConversation === conv.id}
                    //   onClick={() => setActiveConversation(conv.id)}
                    //   sx={{
                    //     borderRadius: 1,
                    //     mb: 1,
                    //     '&.Mui-selected': {
                    //       background: `${currentScheme.colors.primary}15`,
                    //       borderLeft: `3px solid ${currentScheme.colors.primary}`
                    //     }
                    //   }}
                    // >
                    //   <ListItemText
                    //     primary={
                    //       <Typography variant="body2" noWrap>
                    //         {conv.starred && <Star sx={{ fontSize: 14, mr: 0.5 }} />}
                    //         {conv.title}
                    //       </Typography>
                    //     }
                    //     secondary={
                    //       <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    //         {conv.updatedAt.toLocaleDateString()}
                    //       </Typography>
                    //     }
                    //   />
                    // </ListItem>
                  ))} */}
                </List>
                <Button
                  fullWidth
                  startIcon={<Add />}
                  size="small"
                  sx={{ mt: 2 }}
                >
                  New Conversation
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Messages Container */}
          <Box sx={{ 
            flex: 1,
            p: 3,
            overflow: 'auto',
            background: currentScheme.colors.background
          }}>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Action Buttons */}
          <Box sx={{ 
            p: 2,
            borderTop: `1px solid ${currentScheme.colors.components.border}`,
            background: currentScheme.colors.components.card
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Analytics />}
                label="Revenue Analysis"
                size="small"
                onClick={() => handleQuickSuggestion("Show me revenue trends")}
              />
              <Chip
                icon={<Insights />}
                label="Customer Insights"
                size="small"
                onClick={() => handleQuickSuggestion("Analyze customer behavior")}
              />
              <Chip
                icon={<Timeline />}
                label="Predictions"
                size="small"
                onClick={() => handleQuickSuggestion("Predict next quarter sales")}
              />
              <Chip
                icon={<Dashboard />}
                label="Create Dashboard"
                size="small"
                onClick={() => handleQuickSuggestion("Create a sales dashboard")}
              />
            </Box>

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me anything about your data..."
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 20,
                    background: currentScheme.colors.background,
                    pr: 1
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleVoiceToggle}>
                        {isRecording ? (
                          <Mic sx={{ color: currentScheme.colors.buttons.error }} />
                        ) : (
                          <MicOff />
                        )}
                      </IconButton>
                      <IconButton size="small">
                        <AttachFile />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  sx={{
                    background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${currentScheme.colors.primary} 0%, ${currentScheme.colors.secondary} 100%)`,
                      opacity: 0.9
                    },
                    '&:disabled': {
                      background: currentScheme.colors.components.border
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : <Send />}
                </IconButton>
              </motion.div>
            </Box>

            {/* Recording Indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mt: 1,
                  p: 1,
                  borderRadius: 2,
                  background: `${currentScheme.colors.buttons.error}15`,
                  border: `1px solid ${currentScheme.colors.buttons.error}30`
                }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    background: currentScheme.colors.buttons.error,
                    animation: 'pulse 1s infinite'
                  }} />
                  <Typography variant="caption" color={currentScheme.colors.text.secondary}>
                    Listening... Speak now
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ 
        p: 2,
        borderTop: `1px solid ${currentScheme.colors.components.border}`,
        justifyContent: 'space-between'
      }}>
        <Typography variant="caption" color={currentScheme.colors.text.secondary}>
          Powered by Quantum AI • Processing {messages.length} messages
        </Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Rate this conversation">
            <IconButton size="small">
              <ThumbUp sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy conversation">
            <IconButton size="small">
              <ContentCopy sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share insights">
            <IconButton size="small">
              <Share sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AIAssistant