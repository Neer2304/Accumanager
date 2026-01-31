// app/contact/page.tsx - UPDATED WITH SKELETON TABLE
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Box, 
  Stack, 
  Typography, 
  Card,
  CardContent,
  Skeleton,
  Grid
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  WhatsApp,
  Message,
  Map,
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ContactHeader } from '@/components/contacts/ContactHeader';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactCard } from '@/components/contacts/ContactCard';
import { SupportHours } from '@/components/contacts/SupportHours';
import { SocialLinks } from '@/components/contacts/SocialLinks';
import { DepartmentsSection } from '@/components/contacts/DepartmentsSection';
import { FAQCallToAction } from '@/components/contacts/FAQCallToAction';
import { SkeletonTable } from '@/components/common/Table/SkeletonTable';

// Mock data for departments - usually from API
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

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'Call Us',
      details: '+91 9313202038',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'Call Now',
      actionIcon: <Phone />,
      link: 'tel:+919313202038',
    },
    {
      icon: <Email />,
      title: 'Email Us',
      details: 'mehtaneer143@gmail.com',
      description: 'Response within 24 hours',
      action: 'Send Email',
      actionIcon: <Email />,
      link: 'mailto:mehtaneer143@gmail.com',
    },
    {
      icon: <WhatsApp />,
      title: 'WhatsApp Support',
      details: '+91 9313202038',
      description: 'Quick chat support',
      action: 'Start Chat',
      actionIcon: <Message />,
      link: 'https://wa.me/9313202038',
    },
  ];

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate 1 second loading
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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
      
      console.log('✅ Form submitted successfully:', data);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 10000);
      
    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      
      if (err.message.includes('429')) {
        setError('Too many attempts. Please wait a minute and try again.');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <MainLayout title="Contact Us">
        {/* Header Skeleton */}
        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={30} />
        </Box>

        {/* Main Content Skeleton */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.2fr 0.8fr',
          },
          gap: { xs: 4, md: 5 },
          alignItems: 'start',
          mb: 6
        }}>
          {/* Left Column - Form Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
              <Stack spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Box key={item}>
                    <Skeleton variant="text" width="30%" height={25} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                  </Box>
                ))}
                <Skeleton variant="rectangular" height={48} width="40%" sx={{ borderRadius: 1, mt: 2 }} />
              </Stack>
            </CardContent>
          </Card>

          {/* Right Column - Contact Cards Skeleton */}
          <Stack spacing={4}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr',
              },
              gap: 3,
            }}>
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Support Hours Skeleton */}
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton variant="text" width="30%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Social Links Skeleton */}
            <Card>
              <CardContent>
                <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} variant="circular" width={40} height={40} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Departments Section Skeleton */}
        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
          <SkeletonTable 
            columns={4}
            rows={4}
            hasActions={false}
            // hasPagination={false}
          />
        </Box>

        {/* FAQ Call to Action Skeleton */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2, mx: 'auto' }} />
            <Skeleton variant="text" width="80%" height={25} sx={{ mb: 3, mx: 'auto' }} />
            <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 1, mx: 'auto' }} />
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Contact Us">
      <ContactHeader />
      
      {/* Show success message with ticket number */}
      {success && responseData && (
        <Box sx={{ mb: 4 }}>
          <Alert
            severity="success" 
            sx={{ 
              borderRadius: 2,
              border: '1px solid #4caf50',
              '& .MuiAlert-icon': {
                alignItems: 'center',
              }
            }}
            onClose={() => setSuccess(false)}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ✅ Message Sent Successfully!
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Ticket Number:</strong> {responseData.ticketNumber}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Estimated Response:</strong> {responseData.estimatedResponseTime}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email Status:</strong> {responseData.emailSent ? '✅ Emails sent' : '⚠️ Email notifications disabled'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 2 }}>
                We've received your message and will contact you soon. Keep your ticket number for reference.
              </Typography>
            </Box>
          </Alert>
        </Box>
      )}
      
      {/* Show error message */}
      {error && (
        <Box sx={{ mb: 4 }}>
          <Alert
            severity="error"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                alignItems: 'center',
              }
            }}
            onClose={() => setError('')}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              ❌ Submission Failed
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1 }}>
              Please check your information and try again, or contact us directly.
            </Typography>
          </Alert>
        </Box>
      )}
      
      {/* Main Content */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.2fr 0.8fr',
          },
          gap: { xs: 4, md: 5 },
          alignItems: 'start',
        }}
      >
        {/* Left Column - Contact Form */}
        <ContactForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {/* Right Column - Contact Info */}
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Contact Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: '1fr',
              },
              gap: 3,
            }}
          >
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
          </Box>

          {/* Support Hours */}
          <SupportHours />

          {/* Social Links */}
          <SocialLinks />
        </Stack>
      </Box>

      {/* Departments Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Department Contacts
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Reach out to specific departments for specialized assistance
        </Typography>
        
        <SkeletonTable 
          columns={4}
          rows={departmentsData.length}
          hasActions={true}
          // hasPagination={false}
        />
        
        {/* Actual data table (hidden by default, shown when data is loaded) */}
        <Box sx={{ display: 'none' }}>
          {/* Your actual departments table would go here */}
        </Box>
      </Box>

      {/* FAQ Call to Action */}
      <FAQCallToAction />
    </MainLayout>
  );
}