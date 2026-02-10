'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
  Snackbar,
  Alert as MuiAlert,
  Tabs,
  Tab,
  Paper,
  TextareaAutosize,
} from '@mui/material';
import {
  Home as HomeIcon,
  Help as HelpIcon,
  Search,
  VideoLibrary,
  ContactMail,
  Article,
  Rocket,
  CheckCircle,
  Business,
  Inventory,
  Analytics,
  PlayCircle,
  Email,
  Phone,
  Schedule,
  Whatshot,
} from '@mui/icons-material';
import Link from 'next/link';

// Import Google-themed components
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { Divider } from '@/components/ui/Divider';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';

const HelpSupportPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Your message has been sent successfully!',
          severity: 'success',
        });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ Data
  const faqCategories = ['All', 'Getting Started', 'Billing', 'Account', 'Technical', 'Features'];
  const faqs = [
    { question: 'How do I create my first invoice?', answer: 'Go to Billing → Create Invoice, fill in customer details, add items, and send.', category: 'Getting Started' },
    { question: 'How to manage inventory?', answer: 'Navigate to Products → Inventory to add, update, and track stock levels.', category: 'Features' },
    { question: 'How to add team members?', answer: 'Go to Employees → Add Employee, fill in details, and set permissions.', category: 'Account' },
    { question: 'How to generate reports?', answer: 'Visit Reports section and select the type of report you need.', category: 'Features' },
    { question: 'How to change my plan?', answer: 'Go to Settings → Billing to upgrade or downgrade your subscription.', category: 'Billing' },
  ];

  const filteredFaqs = faqs.filter(faq =>
    (selectedCategory === 'All' || faq.category === selectedCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Quick Start Guides
  const quickStartGuides = [
    {
      title: 'First Time Setup',
      icon: <Business />,
      steps: [
        'Set up your business profile',
        'Add your products and services',
        'Configure tax settings',
        'Add your bank account',
        'Invite team members'
      ]
    },
    {
      title: 'Daily Operations',
      icon: <Inventory />,
      steps: [
        'Create invoices for customers',
        'Record payments received',
        'Track inventory changes',
        'Monitor daily sales',
        'Send customer reminders'
      ]
    },
    {
      title: 'Monthly Closing',
      icon: <Analytics />,
      steps: [
        'Generate monthly reports',
        'Review financial statements',
        'Reconcile bank accounts',
        'Send month-end statements',
        'Backup your data'
      ]
    }
  ];

  // Video Guides
  const videoGuides = [
    { title: 'Getting Started Guide', duration: '5:30', description: 'Learn how to set up your account' },
    { title: 'Invoice Creation', duration: '3:45', description: 'Step-by-step invoice tutorial' },
    { title: 'Report Generation', duration: '4:20', description: 'How to create and export reports' },
    { title: 'Team Management', duration: '6:15', description: 'Add and manage team members' },
    { title: 'Mobile App Guide', duration: '4:50', description: 'Using our mobile application' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "#202124" : "#ffffff",
        color: darkMode ? "#e8eaed" : "#202124",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
          background: darkMode
            ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <Box sx={{ 
          maxWidth: 1200, 
          margin: '0 auto' 
        }}>
          <Breadcrumbs
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
              }}
            >
              <HomeIcon
                sx={{
                  mr: 0.5,
                  fontSize: { xs: "16px", sm: "18px" },
                }}
              />
              Dashboard
            </MuiLink>
            <Typography
              color={darkMode ? "#e8eaed" : "#202124"}
              fontWeight={500}
            >
              Help & Support
            </Typography>
          </Breadcrumbs>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={500}
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Help & Support Center
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#9aa0a6" : "#5f6368",
                fontWeight: 400,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Get help, find answers, and connect with our support team
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        {/* System Status */}
        <Alert
          severity="success"
          title="All Systems Operational"
          message="Our services are running smoothly. No issues reported."
          sx={{ mb: 4 }}
        />

        {/* Tabs */}
        <Card
          title="Support Resources"
          subtitle="Choose how you'd like to get help"
          hover={false}
          sx={{ mb: 4 }}
        >
          <Paper sx={{ width: '100%', bgcolor: 'transparent', boxShadow: 'none' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="help support tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  minHeight: 48,
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  '&.Mui-selected': {
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
                }
              }}
            >
              <Tab 
                icon={<Rocket />}
                iconPosition="start"
                label="Quick Help"
              />
              <Tab 
                icon={<Article />}
                iconPosition="start"
                label="Documentation"
              />
              <Tab 
                icon={<ContactMail />}
                iconPosition="start"
                label="Contact Support"
              />
              <Tab 
                icon={<VideoLibrary />}
                iconPosition="start"
                label="Video Guides"
              />
            </Tabs>
          </Paper>
        </Card>

        {/* Tab Content */}
        {/* Quick Help Tab */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* AI Assistant & Quick Actions */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3 
            }}>
              {/* AI Assistant */}
              <Card
                title="AI Assistant"
                subtitle="Get instant answers to your questions"
                hover
                sx={{ flex: 1 }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 3,
                      bgcolor: '#1a73e8',
                      color: 'white'
                    }}
                  >
                    <HelpIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 3 }}>
                    Ask our AI assistant anything about using AccumaManage
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<HelpIcon />}
                    onClick={() => {}}
                    sx={{ 
                      bgcolor: '#1a73e8',
                      color: 'white',
                      px: 4,
                      '&:hover': { bgcolor: '#0d62d9' }
                    }}
                  >
                    Ask AI Assistant
                  </Button>
                </Box>
              </Card>

              {/* Quick Actions */}
              <Card
                title="Quick Actions"
                subtitle="Common support actions"
                hover
                sx={{ flex: 1 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Article />}
                    onClick={() => setTabValue(1)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Browse Documentation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideoLibrary />}
                    onClick={() => setTabValue(3)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Watch Tutorials
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContactMail />}
                    onClick={() => setTabValue(2)}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    Contact Support
                  </Button>
                </Box>
              </Card>
            </Box>

            {/* Quick Start Guides */}
            <Card
              title="Quick Start Guides"
              subtitle="Get up and running quickly"
              hover={false}
            >
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
                p: 2
              }}>
                {quickStartGuides.map((guide, index) => (
                  <Card key={index} hover sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#1a73e8', color: 'white' }}>
                        {guide.icon}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {guide.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {guide.steps.map((step, stepIndex) => (
                        <Box key={stepIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#0d652d', mt: 0.25 }} />
                          <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                            {step}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                ))}
              </Box>
            </Card>
          </Box>
        )}

        {/* Documentation Tab */}
        {tabValue === 1 && (
          <Card
            title="Documentation & FAQ"
            subtitle="Find answers to common questions"
            hover={false}
          >
            <Box sx={{ p: 2.5 }}>
              {/* Search */}
              <Input
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search />}
                size="medium"
                sx={{ mb: 3 }}
              />

              {/* Categories */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {faqCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color={selectedCategory === category ? "primary" : "default"}
                    onClick={() => setSelectedCategory(category)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>

              {/* FAQs */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredFaqs.map((faq, index) => (
                  <Card key={index} hover sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"} sx={{ mb: 2 }}>
                      {faq.answer}
                    </Typography>
                    <Chip
                      label={faq.category}
                      size="small"
                      sx={{
                        bgcolor: alpha('#1a73e8', 0.1),
                        color: '#1a73e8',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Card>
                ))}
              </Box>
            </Box>
          </Card>
        )}

        {/* Contact Support Tab */}
        {tabValue === 2 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4 
          }}>
            {/* Contact Form */}
            <Card
              title="Contact Support"
              subtitle="Send us a message and we'll get back to you"
              hover={false}
              sx={{ flex: 2 }}
            >
              <Box sx={{ p: 2.5 }}>
                <form onSubmit={handleContactSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2 
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Your Name
                        </Typography>
                        <Input
                          placeholder="Enter your name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Email Address
                        </Typography>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Subject
                      </Typography>
                      <Input
                        placeholder="What is this regarding?"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Message
                      </Typography>
                      <TextareaAutosize
                        placeholder="Describe your issue or question in detail..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                        minRows={6}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                          backgroundColor: darkMode ? '#303134' : '#ffffff',
                          color: darkMode ? '#e8eaed' : '#202124',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Card>

            {/* Contact Info */}
            <Card
              title="Contact Information"
              subtitle="Other ways to reach us"
              hover={false}
              sx={{ flex: 1 }}
            >
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#1a73e8', 0.1), color: '#1a73e8' }}>
                      <Email />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom color="#1a73e8">
                        Email Support
                      </Typography>
                      <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        support@accumamanage.com
                      </Typography>
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        Response time: 24 hours
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#0d652d', 0.1), color: '#0d652d' }}>
                      <Phone />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom color="#0d652d">
                        Phone Support
                      </Typography>
                      <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        +1 (555) 123-4567
                      </Typography>
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        Available Mon-Fri, 9AM-6PM EST
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#e37400', 0.1), color: '#e37400' }}>
                      <Schedule />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom color="#e37400">
                        Support Hours
                      </Typography>
                      <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                      </Typography>
                      <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        Saturday: 10:00 AM - 2:00 PM EST
                      </Typography>
                      <Typography variant="caption" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        Emergency support available 24/7
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {/* Video Guides Tab */}
        {tabValue === 3 && (
          <Card
            title="Video Guides"
            subtitle="Learn with step-by-step tutorials"
            hover={false}
          >
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              p: 2.5
            }}>
              {videoGuides.map((video, index) => (
                <Card key={index} hover sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1a73e8', color: 'white' }}>
                      <PlayCircle />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        {video.title}
                      </Typography>
                      <Chip
                        label={video.duration}
                        size="small"
                        sx={{
                          bgcolor: alpha('#e37400', 0.1),
                          color: '#e37400',
                          fontSize: '0.7rem',
                          height: 20,
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color={darkMode ? "#9aa0a6" : "#5f6368"}>
                        {video.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="text"
                    startIcon={<PlayCircle />}
                    sx={{ 
                      color: '#1a73e8',
                      mt: 2,
                      p: 0,
                      '&:hover': { bgcolor: 'transparent' }
                    }}
                  >
                    Watch Now
                  </Button>
                </Card>
              ))}
            </Box>
          </Card>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{
            bgcolor: snackbar.severity === 'success' ? '#0d652d' : '#d93025',
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default HelpSupportPage;