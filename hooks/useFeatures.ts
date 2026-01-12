import { useState, useMemo } from 'react'
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

  return {
    activeCategory,
    setActiveCategory,
    expandedAccordion,
    handleCategoryChange,
    handleAccordionChange,
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
    getCategoryTabs,
    getFilteredCategories,
    getIcon
  }
}