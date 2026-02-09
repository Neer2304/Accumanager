"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Skeleton,
  LinearProgress,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Home as HomeIcon,
  SupportAgent,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactCard } from '@/components/contacts/ContactCard';
import { SupportHours } from '@/components/contacts/SupportHours';
import { SocialLinks } from '@/components/contacts/SocialLinks';
import { FAQCallToAction } from '@/components/contacts/FAQCallToAction';

// Mock data for departments
const departmentsData = [
  {
    department: 'Sales',
    contact: 'sales@example.com',
    responseTime: 'Within 2 hours',
    description: 'Product inquiries, pricing, quotes',
    supportHours: '9 AM - 6 PM',
  },
  {
    department: 'Technical Support',
    contact: 'support@example.com',
    responseTime: 'Within 4 hours',
    description: 'Technical issues, bug reports',
    supportHours: '24/7',
  },
  {
    department: 'Billing',
    contact: 'billing@example.com',
    responseTime: 'Within 24 hours',
    description: 'Invoice, payment, subscription',
    supportHours: '9 AM - 5 PM',
  },
  {
    department: 'Partnership',
    contact: 'partners@example.com',
    responseTime: 'Within 48 hours',
    description: 'Business partnerships, collaborations',
    supportHours: '10 AM - 4 PM',
  },
];

export default function ContactPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [responseData, setResponseData] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning' 
  });

  const contactInfo = [
    {
      icon: 'Phone',
      title: 'Call Us',
      details: '+91 9313202038',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'Call Now',
      actionIcon: 'Phone',
      link: 'tel:+919313202038',
    },
    {
      icon: 'Email',
      title: 'Email Us',
      details: 'mehtaneer143@gmail.com',
      description: 'Response within 24 hours',
      action: 'Send Email',
      actionIcon: 'Email',
      link: 'mailto:mehtaneer143@gmail.com',
    },
    {
      icon: 'WhatsApp',
      title: 'WhatsApp Support',
      details: '+91 9313202038',
      description: 'Quick chat support',
      action: 'Start Chat',
      actionIcon: 'Message',
      link: 'https://wa.me/9313202038',
    },
  ];

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseData(null);
    
    try {
      console.log('📤 Submitting contact form...', formData);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || `Failed to send message (Status: ${response.status})`);
      }
      
      // Success!
      setSuccess(true);
      setResponseData(data.data);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
      
      showSnackbar('Message sent successfully!', 'success');
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
      
    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      
      let errorMessage = 'Failed to send message. Please try again.';
      if (err.message.includes('429')) {
        errorMessage = 'Too many attempts. Please wait a minute and try again.';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <MainLayout title="Contact Us">
        <Box sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
          minHeight: '100vh',
        }}>
          {/* Header Skeleton */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            background: darkMode 
              ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
              : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
          }}>
            <Breadcrumbs sx={{ 
              mb: { xs: 1, sm: 2 }, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
            }}>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={60} />
            </Breadcrumbs>
            
            <Box sx={{ mb: 3 }}>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
            </Box>
          </Box>

          {/* Content Skeleton */}
          <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
            <LinearProgress sx={{ mb: 3 }} />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              mb: 6
            }}>
              {/* Form Skeleton */}
              <Box sx={{ flex: 1.2 }}>
                <Card sx={{
                  borderRadius: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Box key={item}>
                          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                        </Box>
                      ))}
                      <Skeleton variant="rectangular" height={48} width="40%" sx={{ borderRadius: 2, mt: 2 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Contact Info Skeleton */}
              <Box sx={{ flex: 0.8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[1, 2, 3].map((item) => (
                    <Card key={item} sx={{
                      borderRadius: 3,
                      backgroundColor: darkMode ? '#303134' : '#ffffff',
                      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="80%" />
                          </Box>
                        </Box>
                        <Skeleton variant="text" width="40%" />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Contact Us">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <MuiLink
              component={Link}
              href="/dashboard"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': { color: darkMode ? '#8ab4f8' : '#4285f4' }
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </MuiLink>
            <Typography sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Contact Us
            </Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  Contact Us
                </Typography>
                <Typography variant="body1" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Get in touch with our team for support and inquiries
                </Typography>
              </Box>
              
              <Chip
                label="24/7 Support Available"
                color="primary"
                icon={<SupportAgent />}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                  borderColor: darkMode ? alpha('#4285f4', 0.3) : alpha('#4285f4', 0.2),
                  color: darkMode ? '#8ab4f8' : '#4285f4',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
          {/* Success Alert */}
          {success && responseData && (
            <Card sx={{
              mb: 3,
              borderRadius: 3,
              backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.05),
              border: `1px solid ${darkMode ? alpha('#34a853', 0.3) : alpha('#34a853', 0.2)}`,
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#81c995' : '#34a853' }}>
                      ✅ Message Sent Successfully!
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', minWidth: 140 }}>
                            Ticket Number:
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {responseData.ticketNumber}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', minWidth: 140 }}>
                            Estimated Response:
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {responseData.estimatedResponseTime}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124', minWidth: 140 }}>
                            Email Status:
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                            {responseData.emailSent ? '✅ Emails sent' : '⚠️ Email notifications disabled'}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        We've received your message and will contact you soon. Keep your ticket number for reference.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Error Alert */}
          {error && (
            <Card sx={{
              mb: 3,
              borderRadius: 3,
              backgroundColor: darkMode ? alpha('#ea4335', 0.1) : alpha('#ea4335', 0.05),
              border: `1px solid ${darkMode ? alpha('#ea4335', 0.3) : alpha('#ea4335', 0.2)}`,
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}>
                      ❌ Submission Failed
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                      {error}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Please check your information and try again, or contact us directly.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Main Content Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 6
          }}>
            {/* Left Column - Contact Form */}
            <Box sx={{ flex: 1.2 }}>
              <ContactForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            </Box>

            {/* Right Column - Contact Info */}
            <Box sx={{ flex: 0.8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Contact Cards */}
                {contactInfo.map((item, index) => (
                  <ContactCard
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    details={item.details}
                    description={item.description}
                    action={item.action}
                    actionIcon={item.actionIcon}
                    link={item.link}
                  />
                ))}

                {/* Support Hours */}
                <SupportHours />

                {/* Social Links */}
                <SocialLinks />
              </Box>
            </Box>
          </Box>

          {/* Departments Section */}
          <Box sx={{ mb: 6 }}>
            <Card sx={{
              borderRadius: 3,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="h5" fontWeight={500} gutterBottom sx={{ 
                  color: darkMode ? '#e8eaed' : '#202124'
                }}>
                  Department Contacts
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Reach out to specific departments for specialized assistance
                </Typography>
                
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {departmentsData.map((dept, index) => (
                    <Card 
                      key={index}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                        '&:hover': {
                          backgroundColor: darkMode ? '#303134' : '#f1f3f4',
                          borderColor: darkMode ? '#4285f4' : '#4285f4',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 0.5 }}>
                              {dept.department}
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 1 }}>
                              {dept.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={dept.responseTime}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? alpha('#34a853', 0.2) : alpha('#34a853', 0.1),
                                  color: darkMode ? '#81c995' : '#34a853',
                                }}
                              />
                              <Chip 
                                label={dept.supportHours}
                                size="small"
                                sx={{
                                  backgroundColor: darkMode ? alpha('#4285f4', 0.2) : alpha('#4285f4', 0.1),
                                  color: darkMode ? '#8ab4f8' : '#4285f4',
                                }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ 
                              color: darkMode ? '#8ab4f8' : '#4285f4',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                            component="a"
                            href={`mailto:${dept.contact}`}
                            >
                              {dept.contact}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* FAQ Call to Action */}
          <FAQCallToAction />
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}