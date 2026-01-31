import { useState, useMemo, useEffect } from 'react'
import {
  featureCategories,
  benefits,
  integrations,
  heroContent,
  featuresListContent,
  benefitsContent,
  integrationContent,
  ctaContent,
  metaContent,
  iconMap,
  type FeatureCategory,
  type IconName
} from '@/data/featuresContent'

export interface CategoryTab {
  id: string
  label: string
  color?: string
}

export const useFeatures = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate loading data (you can replace this with actual API calls)
  useEffect(() => {
    const loadFeaturesData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Here you could fetch data from API:
        // const response = await fetch('/api/features')
        // if (!response.ok) throw new Error('Failed to load features')
        // const data = await response.json()
        
        // For now, we're using static data
        console.log('Features data loaded successfully')
        
      } catch (err) {
        console.error('Error loading features:', err)
        setError('Failed to load features. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturesData()
  }, [])

  const allFeatures = useMemo(() => 
    featureCategories.flatMap(cat => cat.features),
    []
  )

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string
  ) => {
    if (newCategory !== null) {
      setActiveCategory(newCategory)
    }
  }

  const handleAccordionChange = 
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false)
    }

  const filteredFeatures = useMemo(() => 
    activeCategory === 'all' 
      ? allFeatures 
      : featureCategories.find(cat => cat.id === activeCategory)?.features || [],
    [activeCategory, allFeatures]
  )

  const getCategoryTabs = (): CategoryTab[] => {
    const tabs: CategoryTab[] = [{ id: 'all', label: 'All Features', color: 'primary' }]
    featureCategories.forEach(cat => {
      tabs.push({ 
        id: cat.id, 
        label: cat.title,
        color: cat.color || 'primary'
      })
    })
    return tabs
  }

  const getFilteredCategories = (): FeatureCategory[] => {
    if (activeCategory === 'all') {
      return featureCategories
    }
    const category = featureCategories.find(cat => cat.id === activeCategory)
    return category ? [category] : []
  }

  // Helper to get icon component
  const getIcon = (iconName: IconName, fontSize?: number, color?: string) => {
    const Icon = iconMap[iconName]
    return Icon;
  }

  // Retry loading
  const retryLoading = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return {
    // State
    activeCategory,
    setActiveCategory,
    expandedAccordion,
    isLoading,
    error,
    
    // Handlers
    handleCategoryChange,
    handleAccordionChange,
    retryLoading,
    
    // Data
    filteredFeatures,
    allFeatures,
    featureCategories,
    benefits,
    integrations,
    heroContent,
    featuresListContent,
    benefitsContent,
    integrationContent,
    ctaContent,
    metaContent,
    
    // Helper functions
    getCategoryTabs,
    getFilteredCategories,
    getIcon
  }
}