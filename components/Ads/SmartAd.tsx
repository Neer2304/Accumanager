// components/Ads/SmartAd.tsx - FIXED VERSION
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Close,
  OpenInNew,
  TrendingUp,
  LocalOffer,
  Campaign,
} from '@mui/icons-material'

interface AdProps {
  type?: 'banner' | 'sidebar' | 'inline'
  category?: 'tech' | 'business' | 'saas'
  priority?: 'high' | 'medium' | 'low'
}

// Ad type definition
interface AdItem {
  title: string
  description: string
  cta: string
  url: string
  color: string
}

// Type-safe ads object
const ads: Record<'tech' | 'business' | 'saas', AdItem[]> = {
  tech: [
    {
      title: "🚀 Boost Your SaaS Growth",
      description: "AI-powered analytics platform. Free 14-day trial.",
      cta: "Try Free Trial",
      url: "https://example.com/saas-tool",
      color: "#3B82F6",
    },
    {
      title: "📊 Advanced CRM Solution",
      description: "Manage customers efficiently. 30% off first year.",
      cta: "Get Discount",
      url: "https://example.com/crm",
      color: "#10B981",
    }
  ],
  business: [
    {
      title: "💼 Business Automation",
      description: "Automate workflows with no-code platform.",
      cta: "Learn More",
      url: "https://example.com/automation",
      color: "#8B5CF6",
    },
    {
      title: "📈 Financial Dashboard",
      description: "Real-time financial analytics for startups.",
      cta: "View Demo",
      url: "https://example.com/finance",
      color: "#F59E0B",
    }
  ],
  saas: [ // Added saas category
    {
      title: "🔧 DevOps Platform",
      description: "Automate deployment and scaling.",
      cta: "Start Free",
      url: "https://example.com/devops",
      color: "#EC4899",
    },
    {
      title: "🎯 Marketing Automation",
      description: "AI-driven marketing campaigns.",
      cta: "Get Started",
      url: "https://example.com/marketing",
      color: "#8B5CF6",
    }
  ]
}

const SmartAd = ({ type = 'banner', category = 'tech', priority = 'medium' }: AdProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [impressionCounted, setImpressionCounted] = useState(false)
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null)

  // Initialize ad on mount
  useEffect(() => {
    const currentAds = ads[category] || ads.tech
    const randomAd = currentAds[Math.floor(Math.random() * currentAds.length)]
    setSelectedAd(randomAd)
    
    // Count impression
    if (!impressionCounted && isVisible) {
      console.log('Ad impression counted for category:', category)
      setImpressionCounted(true)
      // Here you would send to your analytics
      // trackImpression(category, randomAd.title)
    }
  }, [category, impressionCounted, isVisible])

  const handleClick = () => {
    if (!selectedAd) return
    
    // Track click
    console.log('Ad clicked:', selectedAd.title)
    // trackClick(category, selectedAd.title)
    window.open(selectedAd.url, '_blank', 'noopener,noreferrer')
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('hideAds', 'true')
    // trackAdDismiss(category, selectedAd?.title || 'unknown')
  }

  // Don't show if user has disabled ads
  useEffect(() => {
    const hideAds = localStorage.getItem('hideAds')
    if (hideAds === 'true') {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible || !selectedAd) return null

  return (
    <Card
      sx={{
        mb: 3,
        border: `2px solid ${selectedAd.color}40`,
        background: `linear-gradient(135deg, ${selectedAd.color}10 0%, transparent 100%)`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${selectedAd.color}20`,
        }
      }}
    >
      {/* Close button */}
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          color: 'text.secondary',
          background: 'rgba(255,255,255,0.8)',
          '&:hover': {
            background: 'rgba(255,255,255,1)',
          }
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      {/* Ad Label */}
      <Chip
        label="Sponsored"
        size="small"
        icon={<Campaign fontSize="small" />}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          background: `${selectedAd.color}20`,
          color: selectedAd.color,
          fontSize: '0.7rem',
          fontWeight: 'medium',
        }}
      />

      <CardContent sx={{ pt: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${selectedAd.color} 0%, ${selectedAd.color}CC 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}
          >
            <TrendingUp />
          </Box>
          
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.2 }}>
              {selectedAd.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {selectedAd.description}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mt={2} flexWrap="wrap">
              <Chip
                label={`${category.toUpperCase()}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}
              />
              <Chip
                label="Trusted Partner"
                size="small"
                variant="outlined"
                icon={<LocalOffer fontSize="small" />}
              />
              <Typography variant="caption" color="text.secondary">
                • Recommended based on your interests
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleClick}
          endIcon={<OpenInNew />}
          sx={{
            mt: 3,
            py: 1.2,
            background: `linear-gradient(135deg, ${selectedAd.color} 0%, ${selectedAd.color}CC 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${selectedAd.color}CC 0%, ${selectedAd.color} 100%)`,
              transform: 'scale(1.02)',
            },
            transition: 'all 0.2s ease',
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}
        >
          {selectedAd.cta}
        </Button>

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            mt: 2, 
            textAlign: 'center',
            fontSize: '0.7rem'
          }}
        >
          Advertisement • Your support helps us keep this service free
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SmartAd