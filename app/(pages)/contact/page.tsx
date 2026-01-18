// app/contact/page.tsx - UPDATED WITH BETTER API CALL
"use client";

import React, { useState } from 'react';
import { Alert, Box, Stack, Typography } from '@mui/material';
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [responseData, setResponseData] = useState<any>(null);

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Corporate Office',
      details: 'Bengaluru, Karnataka, India',
      description: 'Tech Hub of India',
      action: 'View on Map',
      actionIcon: <Map />,
      link: 'https://maps.google.com/?q=Bengaluru,+Karnataka,+India',
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'Call Now',
      actionIcon: <Phone />,
      link: 'tel:+919876543210',
    },
    {
      icon: <Email />,
      title: 'Email Us',
      details: 'support@accumanage.com',
      description: 'Response within 24 hours',
      action: 'Send Email',
      actionIcon: <Email />,
      link: 'mailto:support@accumanage.com',
    },
    {
      icon: <WhatsApp />,
      title: 'WhatsApp Support',
      details: '+91 98765 43210',
      description: 'Quick chat support',
      action: 'Start Chat',
      actionIcon: <Message />,
      link: 'https://wa.me/919876543210',
    },
  ];

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
        // Handle specific error messages
        if (data.errors) {
          // If there are field-specific errors
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
      
      // Better error messages for common issues
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
      <DepartmentsSection />

      {/* FAQ Call to Action */}
      <FAQCallToAction />
    </MainLayout>
  );
}