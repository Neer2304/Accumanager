'use client'

import React from 'react'
import Head from 'next/head'
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
  Card,
  CardContent,
  Grid,
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

// Skeleton Components
const HeroSkeleton = () => (
  <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 3 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
      </Box>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  </Box>
)

const FeaturesSkeleton = () => (
  <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
        <Skeleton variant="text" width="40%" height={50} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto', mb: 4 }} />
      </Box>
      
      {/* Tabs Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6 }}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        ))}
      </Box>

      {/* Features Grid Skeleton */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 4
      }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={30} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  </Box>
)

const BenefitsSkeleton = () => (
  <Box sx={{ 
    py: { xs: 8, sm: 10, md: 12 },
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
        <Skeleton variant="text" width="40%" height={50} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mx: 'auto' }} />
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
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={30} />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  </Box>
)

const IntegrationSkeleton = () => (
  <Box sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
        <Skeleton variant="text" width="50%" height={50} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="70%" height={30} sx={{ mx: 'auto' }} />
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(6, 1fr)'
        },
        gap: 3
      }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Box key={item} sx={{ textAlign: 'center' }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="80%" height={25} sx={{ mx: 'auto' }} />
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

const CTASkeleton = () => (
  <Box sx={{ 
    py: { xs: 8, sm: 10, md: 12 },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4, bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
        </Box>
      </Box>
    </Container>
  </Box>
)

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
    getFilteredCategories,
    isLoading
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
        {/* Loading State */}
        {isLoading ? (
          <>
            <HeroSkeleton />
            <FeaturesSkeleton />
            <BenefitsSkeleton />
            <IntegrationSkeleton />
            <CTASkeleton />
          </>
        ) : (
          <>
            {/* Hero Section */}
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
          </>
        )}
      </Box>
    </>
  )
}