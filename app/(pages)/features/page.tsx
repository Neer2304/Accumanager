'use client'

import React from 'react'
import Head from 'next/head'
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useFeatures } from '@/hooks/useFeatures'
import {
  HeroSection,
  CategoryTabs,
  CategoryCard,
  FeatureItem,
  BenefitCard,
  MobileAccordion,
  IntegrationSection,
  CTASection
} from '@/components/feature'

export default function FeaturesPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  
  const {
    activeCategory,
    handleCategoryChange,
    filteredFeatures,
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
    getFilteredCategories
  } = useFeatures()

  const categoryTabs = getCategoryTabs()

  return (
    <>
      <Head>
        <title>{metaContent.title}</title>
        <meta name="description" content={metaContent.description} />
        <meta name="keywords" content={metaContent.keywords} />
      </Head>

      <Box sx={{ minHeight: '100vh' }}>
        <HeroSection 
          {...heroContent}
          isMobile={isMobile}
        />

        {/* Features Section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
          <Container maxWidth="lg">
            {isMobile ? (
              <MobileAccordion categories={featureCategories} />
            ) : (
              <>
                {/* Desktop Layout */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    {featuresListContent.title}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h5"}
                    color="text.secondary"
                    sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
                  >
                    {featuresListContent.subtitle}
                  </Typography>

                  <CategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </Box>

                {activeCategory === 'all' ? (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap: 4
                  }}>
                    {getFilteredCategories().map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap: 4
                  }}>
                    {filteredFeatures.map((feature) => (
                      <FeatureItem key={feature.id} feature={feature} />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box sx={{ 
          py: { xs: 8, sm: 10, md: 12 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ color: 'primary.dark' }}
              >
                {benefitsContent.title}
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h5"}
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                {benefitsContent.subtitle}
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 4
            }}>
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </Box>
          </Container>
        </Box>

        {/* Integration Section */}
        <IntegrationSection 
          {...integrationContent}
          integrations={integrations}
          isMobile={isMobile}
        />

        {/* CTA Section */}
        <CTASection
          {...ctaContent}
          isAuthenticated={isAuthenticated}
          authLoading={authLoading}
          isMobile={isMobile}
        />
      </Box>
    </>
  )
}