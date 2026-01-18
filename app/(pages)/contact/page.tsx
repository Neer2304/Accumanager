// app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Snackbar,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  WhatsApp,
  Message,
  Business,
  Person,
  CheckCircle,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  Map,
  Schedule,
  SupportAgent,
  QuestionAnswer,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';

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
  const [error, setError] = useState('');
  const [activeSupport, setActiveSupport] = useState(true);

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Corporate Office',
      details: 'Bengaluru, Karnataka, India',
      description: 'Tech Hub of India',
      action: 'View on Map',
      actionIcon: <Map />,
      link: 'https://maps.google.com/?q=Bengaluru,+Karnataka,+India',
    },
    {
      icon: <Phone sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Call Us',
      details: '+91 98765 43210',
      description: 'Mon-Fri, 9 AM - 6 PM IST',
      action: 'Call Now',
      actionIcon: <Phone />,
      link: 'tel:+919876543210',
    },
    {
      icon: <Email sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Email Us',
      details: 'support@accumanage.com',
      description: 'Response within 24 hours',
      action: 'Send Email',
      actionIcon: <Email />,
      link: 'mailto:support@accumanage.com',
    },
    {
      icon: <WhatsApp sx={{ fontSize: 32, color: '#25D366' }} />,
      title: 'WhatsApp Support',
      details: '+91 98765 43210',
      description: 'Quick chat support',
      action: 'Start Chat',
      actionIcon: <Message />,
      link: 'https://wa.me/919876543210',
    },
  ];

  const supportHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM IST' },
    { day: 'Saturday', time: '10:00 AM - 2:00 PM IST' },
    { day: 'Sunday', time: 'Emergency Support Only' },
  ];

  const socialLinks = [
    { icon: <Twitter />, label: 'Twitter', link: 'https://twitter.com/accumanage' },
    { icon: <LinkedIn />, label: 'LinkedIn', link: 'https://linkedin.com/company/accumanage' },
    { icon: <Facebook />, label: 'Facebook', link: 'https://facebook.com/accumanage' },
    { icon: <Instagram />, label: 'Instagram', link: 'https://instagram.com/accumanage' },
  ];

  const departments = [
    { name: 'Sales', email: 'sales@accumanage.com', desc: 'Get pricing & product info' },
    { name: 'Support', email: 'support@accumanage.com', desc: 'Technical help & troubleshooting' },
    { name: 'Partnerships', email: 'partners@accumanage.com', desc: 'Business collaborations' },
    { name: 'Careers', email: 'careers@accumanage.com', desc: 'Join our team' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
      py: 6,
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip 
            label="24/7 Support Available" 
            color="primary" 
            icon={<SupportAgent />}
            sx={{ mb: 2 }}
          />
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Have questions? We're here to help. Reach out to our team for any inquiries about AccumaManage.
          </Typography>
        </Box>

        {/* Main Grid */}
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}>
                <Typography variant="h5" fontWeight="bold">
                  Send us a Message
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Fill out the form below and we'll get back to you within 24 hours.
                </Typography>
              </Box>
              
              <Box sx={{ p: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="What's this regarding?"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message *"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Tell us how we can help..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                        sx={{ 
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          }
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            {/* Contact Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {contactInfo.map((item, index) => (
                <Grid item xs={12} sm={6} md={12} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        {item.icon}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        {item.details}
                      </Typography>
                      <Button
                        component="a"
                        href={item.link}
                        target="_blank"
                        size="small"
                        startIcon={item.actionIcon}
                        sx={{ mt: 1 }}
                      >
                        {item.action}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Support Hours */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Schedule sx={{ fontSize: 28, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Support Hours
                </Typography>
              </Box>
              
              {supportHours.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: index < supportHours.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}>
                  <Typography variant="body2" fontWeight="medium">
                    {item.day}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.time}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SupportAgent fontSize="small" />
                  <strong>Emergency Support:</strong> Available 24/7 for critical issues
                </Typography>
              </Box>
            </Paper>

            {/* Social Links */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Connect With Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Follow us on social media for updates and tips
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.link}
                    target="_blank"
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 1.5,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Departments Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Contact Specific Departments
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Need to reach a specific team? Here's who to contact for different inquiries.
          </Typography>
          
          <Grid container spacing={3}>
            {departments.map((dept, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 2 }}>
                      {dept.desc}
                    </Typography>
                    <Button
                      component="a"
                      href={`mailto:${dept.email}`}
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {dept.email}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Call to Action */}
        <Box sx={{ 
          mt: 8, 
          p: 5, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}>
          <QuestionAnswer sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Check Our FAQ First
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600, mx: 'auto' }}>
            Many common questions are already answered in our comprehensive FAQ section.
          </Typography>
          <Button
            component={Link}
            href="/faq"
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            Visit FAQ Section
          </Button>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          icon={<CheckCircle fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Message Sent Successfully!
          </Typography>
          <Typography variant="body2">
            We'll get back to you within 24 hours.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}