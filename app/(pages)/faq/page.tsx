// app/faq/page.tsx - FIXED VERSION
"use client";

import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import {
  FaqHeader,
  FaqCategory,
  FaqSearch,
  FaqContactCard,
  faqCategories,
  FaqIcons,
} from '@/components/faqs';

export default function FAQPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Expand all categories when searching
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

  // Destructure icons from FaqIcons
  const SearchIcon = FaqIcons.search;
  const StarIcon = FaqIcons.star;
  const LightbulbIcon = FaqIcons.lightbulb;
  const CheckIcon = FaqIcons.check;
  const TeamIcon = FaqIcons.team;
  const ArrowForwardIcon = FaqIcons.arrowForward;

  return (
    <MainLayout title="FAQ & Help Center">
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Header */}
        <FaqHeader />

        {/* Search */}
        <FaqSearch onSearch={handleSearch} searchResults={searchResults || undefined} />

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
          <Box sx={{ textAlign: 'center', py: 6 }}>
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
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon fontSize="small" />
              Browse by Category
            </Typography>
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

        {/* Additional Resources - Using flexbox instead of Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 6,
        }}>
          {/* Video Tutorials Card */}
          <Box
            sx={{
              flex: 1,
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Video Tutorials
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
              Watch step-by-step guides on how to use all features
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 'bold' }}
            >
              Watch Now
            </Button>
          </Box>
          
          {/* Documentation Card */}
          <Box
            sx={{
              flex: 1,
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Documentation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
              Read our comprehensive documentation and API guides
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 'bold' }}
            >
              Read Docs
            </Button>
          </Box>
          
          {/* Community Forum Card */}
          <Box
            sx={{
              flex: 1,
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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Community Forum
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
              Connect with other users and share tips & tricks
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 'bold' }}
            >
              Join Community
            </Button>
          </Box>
        </Box>

        {/* Footer Note */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            mt: 4,
            pt: 4,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 
          This FAQ is regularly updated. Can't find what you're looking for? Contact our support team.
        </Typography>
      </Container>
    </MainLayout>
  );
}