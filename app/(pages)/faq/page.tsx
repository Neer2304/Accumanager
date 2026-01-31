// app/faq/page.tsx - UPDATED WITH SKELETONS
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Download,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  FaqHeader,
  FaqCategory,
  FaqSearch,
  FaqContactCard,
  faqCategories,
  FaqIcons,
} from '@/components/faqs';
import { Icons } from '@/components/common/icons/index';
import { Heading2, BodyText, MutedText, SectionTitle, Heading4 } from '@/components/common/Text';

// FAQ Skeleton Component
const FAQSkeleton = () => (
  <>
    {/* Header Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width={200} height={25} />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3
      }}>
        <Box>
          <Skeleton variant="text" width={300} height={50} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={250} height={25} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Box>

    {/* Search Bar Skeleton */}
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
    </Paper>

    {/* Categories Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width={200} height={35} sx={{ mb: 3 }} />
      
      {/* Tags Skeleton */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} variant="rectangular" width={100} height={32} sx={{ borderRadius: 16 }} />
        ))}
      </Box>

      {/* FAQ Categories Skeleton */}
      <Stack spacing={3}>
        {[1, 2, 3].map((category) => (
          <Card key={category}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              
              <Stack spacing={2}>
                {[1, 2, 3].map((question) => (
                  <Box key={question} sx={{ pl: 2 }}>
                    <Skeleton variant="text" width="90%" height={25} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="70%" height={20} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>

    {/* Contact Card Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
    </Box>

    {/* Resources Skeleton */}
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      gap: 3,
      mb: 6
    }}>
      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={120} height={40} sx={{ mx: 'auto' }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  </>
);

export default function FAQPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setExpandedCategory(null);
    }
  };

  // Filter categories based on active filter
  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return faqCategories;
    
    return faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.tags?.includes(activeFilter.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
  }, [activeFilter]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const results: Array<{ id: string; question: string; category: string }> = [];
    
    faqCategories.forEach(category => {
      category.questions.forEach(question => {
        if (
          question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          results.push({
            id: question.id,
            question: question.question,
            category: category.title,
          });
        }
      });
    });
    
    return results;
  }, [searchQuery]);

  // Toggle category
  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Popular tags for filtering
  const popularTags = [
    { id: 'all', label: 'All Questions', count: faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0) },
    { id: 'account', label: 'Account', count: 8 },
    { id: 'attendance', label: 'Attendance', count: 6 },
    { id: 'billing', label: 'Billing', count: 5 },
    { id: 'security', label: 'Security', count: 4 },
    { id: 'reports', label: 'Reports', count: 3 },
  ];

  // Destructure icons
  const SearchIcon = FaqIcons.search;
  const StarIcon = FaqIcons.star;
  const LightbulbIcon = FaqIcons.lightbulb;
  const CheckIcon = FaqIcons.check;
  const TeamIcon = FaqIcons.team;
  const ArrowForwardIcon = FaqIcons.arrowForward;

  const handleBack = () => {
    window.history.back();
  };

  const handleDownloadFAQ = () => {
    try {
      const content = `
FAQ & HELP CENTER
================
Generated on: ${new Date().toLocaleDateString()}

${faqCategories.map(category => `
${category.title.toUpperCase()}
${'='.repeat(category.title.length)}

${category.questions.map((q, index) => `
${index + 1}. ${q.question}
   ${q.answer}

   Tags: ${q.tags?.join(', ') || 'None'}
   ${'-'.repeat(50)}
`).join('\n')}
`).join('\n\n')}

Total Questions: ${faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}
Total Categories: ${faqCategories.length}

For additional help, contact: support@attendancepro.com
      `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `faq_guide_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('FAQ guide downloaded successfully!');
    } catch (error) {
      console.error('Error downloading FAQ:', error);
      alert('Failed to download FAQ guide');
    }
  };

  return (
    <MainLayout title="FAQ Management">
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Loading State */}
        {loading ? (
          <FAQSkeleton />
        ) : (
          <>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              {/* Back Button */}
              <Button
                startIcon={<BackIcon />}
                onClick={handleBack}
                sx={{ mb: 2 }}
                size="small"
                variant="outlined"
              >
                Back to Dashboard
              </Button>

              {/* Breadcrumbs */}
              <Breadcrumbs sx={{ mb: 2 }}>
                <MuiLink
                  component={Link}
                  href="/dashboard"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Dashboard
                </MuiLink>
                <Typography color="text.primary">FAQ & Help</Typography>
              </Breadcrumbs>

              {/* Main Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3
              }}>
                <Box>
                  <Heading2 gutterBottom>
                    ❓ FAQ & Help Center
                  </Heading2>
                  <MutedText>
                    Find answers to common questions and learn how to use the system
                  </MutedText>
                </Box>

                <Stack 
                  direction="row" 
                  spacing={1}
                  alignItems="center"
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-end' }
                  }}
                >
                  {/* Status Chips */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip 
                      label={`${faqCategories.length} Categories`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} Questions`}
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                    {activeFilter !== 'all' && (
                      <Chip 
                        label={`${popularTags.find(t => t.id === activeFilter)?.label}`}
                        size="small"
                        color="secondary"
                        onDelete={() => setActiveFilter('all')}
                      />
                    )}
                  </Stack>

                  {/* Download Button */}
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadFAQ}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                      }
                    }}
                  >
                    {isMobile ? 'Download' : 'Download FAQ'}
                  </Button>
                </Stack>
              </Box>

              {/* Search Bar */}
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'background.paper',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <FaqSearch onSearch={handleSearch} searchResults={searchResults || undefined} />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Need more help? <Link href="/support" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                      Contact Support
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Search Results Alert */}
            {searchQuery.trim() && searchResults && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                }
              >
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Alert>
            )}

            {/* No Results */}
            {searchQuery.trim() && searchResults && searchResults.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
                <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No results found for "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try different keywords or browse the categories below
                </Typography>
              </Box>
            )}

            {/* Popular Tags */}
            {!searchQuery.trim() && (
              <Box sx={{ mb: 4 }}>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon fontSize="small" />
                  Browse by Category
                </SectionTitle>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={`${tag.label} (${tag.count})`}
                      onClick={() => setActiveFilter(tag.id)}
                      color={activeFilter === tag.id ? 'primary' : 'default'}
                      variant={activeFilter === tag.id ? 'filled' : 'outlined'}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        fontWeight: activeFilter === tag.id ? 'bold' : 'normal',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* FAQ Categories */}
            {!searchQuery.trim() && (
              <Box sx={{ mb: 6 }}>
                {filteredCategories.map((category) => (
                  <FaqCategory
                    key={category.id}
                    category={category}
                    expanded={expandedCategory === category.id}
                    onToggle={handleToggleCategory}
                  />
                ))}
              </Box>
            )}

            {/* Contact Card */}
            <Box sx={{ mb: 4 }}>
              <FaqContactCard onContactClick={() => window.open('mailto:support@attendancepro.com')} />
            </Box>

            {/* Additional Resources */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 6,
            }}>
              {/* Video Tutorials Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mb: 2,
                  }}
                >
                  <LightbulbIcon fontSize="large" />
                </Box>
                <Heading4 gutterBottom>
                  Video Tutorials
                </Heading4>
                <BodyText color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                  Watch step-by-step guides on how to use all features
                </BodyText>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 'bold' }}
                >
                  Watch Now
                </Button>
              </Card>
              
              {/* Documentation Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    mb: 2,
                  }}
                >
                  <CheckIcon fontSize="large" />
                </Box>
                <Heading4 gutterBottom>
                  Documentation
                </Heading4>
                <BodyText color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                  Read our comprehensive documentation and API guides
                </BodyText>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 'bold' }}
                >
                  Read Docs
                </Button>
              </Card>
              
              {/* Community Forum Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    mb: 2,
                  }}
                >
                  <TeamIcon fontSize="large" />
                </Box>
                <Heading4 gutterBottom>
                  Community Forum
                </Heading4>
                <BodyText color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                  Connect with other users and share tips & tricks
                </BodyText>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 'bold' }}
                >
                  Join Community
                </Button>
              </Card>
            </Box>

            {/* Footer Note */}
            <MutedText
              align="center"
              sx={{
                mt: 4,
                pt: 4,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 
              This FAQ is regularly updated. Can't find what you're looking for? Contact our support team.
            </MutedText>
          </>
        )}
      </Container>
    </MainLayout>
  );
}