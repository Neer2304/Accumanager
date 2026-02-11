"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  useTheme,
  alpha,
  Breadcrumbs,
  Divider,
  IconButton,
  Collapse,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy,
  ExpandMore,
  Http,
  Code,
  Security,
  Speed,
  Lock,
  CheckCircle,
  Search,
  FilterList,
  Home as HomeIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: 'customers' | 'products' | 'invoices' | 'analytics';
  requiresAuth: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  exampleRequest?: string;
  exampleResponse?: string;
}

export default function ApiDocumentationPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const endpoints: Endpoint[] = [
    {
      id: 'get-customers',
      method: 'GET',
      path: '/api/customers',
      title: 'List Customers',
      description: 'Retrieve paginated customers list',
      category: 'customers',
      requiresAuth: true,
      parameters: [
        { name: 'page', type: 'number', required: false, description: 'Page number' },
        { name: 'limit', type: 'number', required: false, description: 'Items per page' },
        { name: 'search', type: 'string', required: false, description: 'Search customers' },
      ],
      exampleRequest: `GET /api/customers?page=1&limit=20\nAuthorization: Bearer YOUR_TOKEN`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "customers": [...],\n    "pagination": {...}\n  }\n}`,
    },
    {
      id: 'create-customer',
      method: 'POST',
      path: '/api/customers',
      title: 'Create Customer',
      description: 'Add new customer to system',
      category: 'customers',
      requiresAuth: true,
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Customer name' },
        { name: 'email', type: 'string', required: true, description: 'Customer email' },
        { name: 'phone', type: 'string', required: false, description: 'Phone number' },
      ],
      exampleRequest: `POST /api/customers\nAuthorization: Bearer YOUR_TOKEN\nContent-Type: application/json\n\n{\n  "name": "John Doe",\n  "email": "john@example.com"\n}`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "customer": {\n      "id": "123",\n      "name": "John Doe",\n      "email": "john@example.com"\n    }\n  }\n}`,
    },
    {
      id: 'get-products',
      method: 'GET',
      path: '/api/products',
      title: 'List Products',
      description: 'Get all products with inventory',
      category: 'products',
      requiresAuth: true,
      parameters: [
        { name: 'category', type: 'string', required: false, description: 'Filter category' },
        { name: 'inStock', type: 'boolean', required: false, description: 'In stock only' },
      ],
      exampleRequest: `GET /api/products?category=electronics\nAuthorization: Bearer YOUR_TOKEN`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "products": [\n      {\n        "id": "p123",\n        "name": "Laptop",\n        "price": 999.99,\n        "stock": 15\n      }\n    ]\n  }\n}`,
    },
    {
      id: 'update-product',
      method: 'PUT',
      path: '/api/products/{id}',
      title: 'Update Product',
      description: 'Update product details',
      category: 'products',
      requiresAuth: true,
      parameters: [
        { name: 'name', type: 'string', required: false, description: 'Product name' },
        { name: 'price', type: 'number', required: false, description: 'Product price' },
        { name: 'stock', type: 'number', required: false, description: 'Stock quantity' },
      ],
      exampleRequest: `PUT /api/products/p123\nAuthorization: Bearer YOUR_TOKEN\nContent-Type: application/json\n\n{\n  "price": 899.99,\n  "stock": 20\n}`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "product": {\n      "id": "p123",\n      "name": "Laptop",\n      "price": 899.99,\n      "stock": 20\n    }\n  }\n}`,
    },
    {
      id: 'get-invoices',
      method: 'GET',
      path: '/api/invoices',
      title: 'List Invoices',
      description: 'Retrieve invoices with filters',
      category: 'invoices',
      requiresAuth: true,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Status filter' },
        { name: 'customerId', type: 'string', required: false, description: 'Customer filter' },
      ],
      exampleRequest: `GET /api/invoices?status=paid\nAuthorization: Bearer YOUR_TOKEN`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "invoices": [\n      {\n        "id": "inv123",\n        "total": 999.99,\n        "status": "paid"\n      }\n    ]\n  }\n}`,
    },
    {
      id: 'create-invoice',
      method: 'POST',
      path: '/api/invoices',
      title: 'Create Invoice',
      description: 'Generate new invoice',
      category: 'invoices',
      requiresAuth: true,
      parameters: [
        { name: 'customerId', type: 'string', required: true, description: 'Customer ID' },
        { name: 'items', type: 'array', required: true, description: 'Invoice items' },
      ],
      exampleRequest: `POST /api/invoices\nAuthorization: Bearer YOUR_TOKEN\nContent-Type: application/json\n\n{\n  "customerId": "cust123",\n  "items": [\n    {\n      "productId": "p123",\n      "quantity": 1,\n      "price": 999.99\n    }\n  ]\n}`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "invoice": {\n      "id": "inv456",\n      "invoiceNumber": "INV-2024-001",\n      "total": 999.99\n    }\n  }\n}`,
    },
    {
      id: 'get-analytics',
      method: 'GET',
      path: '/api/analytics',
      title: 'Get Analytics',
      description: 'Retrieve business analytics',
      category: 'analytics',
      requiresAuth: true,
      parameters: [
        { name: 'period', type: 'string', required: false, description: 'Time period' },
        { name: 'startDate', type: 'string', required: false, description: 'Start date' },
      ],
      exampleRequest: `GET /api/analytics?period=monthly\nAuthorization: Bearer YOUR_TOKEN`,
      exampleResponse: `{\n  "success": true,\n  "data": {\n    "revenue": 15000,\n    "totalSales": 120,\n    "topProducts": [...]\n  }\n}`,
    },
  ];

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#34a853'; // Green
      case 'POST': return '#4285f4'; // Blue
      case 'PUT': return '#fbbc04'; // Yellow
      case 'DELETE': return '#ea4335'; // Red
      default: return darkMode ? '#9aa0a6' : '#5f6368';
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const categories = [
    { value: 'all', label: 'All APIs' },
    { value: 'customers', label: 'Customers' },
    { value: 'products', label: 'Products' },
    { value: 'invoices', label: 'Invoices' },
    { value: 'analytics', label: 'Analytics' },
  ];

  return (
    <MainLayout title="API Documentation">
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
          background: darkMode 
            ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
          }}>
            <Link 
              href="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? '#e8eaed' : '#202124'} fontWeight={400}>
              API Documentation
            </Typography>
          </Breadcrumbs>

          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}>
            <Typography 
              variant="h4" 
              fontWeight={500} 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              📚 API Documentation
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                fontWeight: 300,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Documentation for all available REST APIs in AccuManage
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
            mt: 3,
          }}>
            <Chip
              label={`${endpoints.length} Endpoints`}
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#4285f4', 0.1) : alpha('#4285f4', 0.08),
                borderColor: alpha('#4285f4', 0.3),
                color: darkMode ? '#8ab4f8' : '#4285f4',
              }}
            />
            <Chip
              label="Authentication Required"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#34a853', 0.1) : alpha('#34a853', 0.08),
                borderColor: alpha('#34a853', 0.3),
                color: darkMode ? '#81c995' : '#34a853',
              }}
            />
            <Chip
              label="REST API"
              variant="outlined"
              sx={{
                backgroundColor: darkMode ? alpha('#fbbc04', 0.1) : alpha('#fbbc04', 0.08),
                borderColor: alpha('#fbbc04', 0.3),
                color: darkMode ? '#fdd663' : '#fbbc04',
              }}
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Quick Stats */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {[
              { 
                title: 'Total Endpoints', 
                value: endpoints.length, 
                icon: '🔌', 
                color: '#4285f4',
                description: 'Available API endpoints' 
              },
              { 
                title: 'Requires Auth', 
                value: endpoints.filter(e => e.requiresAuth).length, 
                icon: '🔐', 
                color: '#34a853',
                description: 'Authentication needed' 
              },
              { 
                title: 'Categories', 
                value: categories.length - 1, 
                icon: '📂', 
                color: '#ea4335',
                description: 'API categories' 
              },
              { 
                title: 'Methods', 
                value: 4, 
                icon: '🔄', 
                color: '#fbbc04',
                description: 'HTTP methods' 
              },
            ].map((stat, index) => (
              <Card 
                key={`stat-${index}`}
                hover
                sx={{ 
                  flex: '1 1 calc(25% - 12px)', 
                  minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 12px)' },
                  p: { xs: 1.5, sm: 2, md: 3 }, 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  background: darkMode 
                    ? `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.03)} 100%)`,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#9aa0a6' : '#5f6368', 
                          fontWeight: 400,
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: 'block',
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h4"
                        sx={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: { xs: 0.75, sm: 1 }, 
                      borderRadius: '10px', 
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Header Controls */}
          <Card
            title="🔍 API Explorer"
            subtitle="Browse and test all available endpoints"
            hover
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Input
                  fullWidth
                  placeholder="Search APIs by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon={<Search />}
                />
                
                <Input
                  select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 200 } }}
                  startIcon={<FilterList />}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Input>
              </Box>
            </Box>
          </Card>

          {/* Getting Started Alert */}
          <Alert
            severity="info"
            title="🔑 Authentication Required"
            message="All API requests require authentication. Get your API key from Settings."
            action={
              <Button
                variant="outlined"
                component={Link} 
                href="/dashboard/settings/api"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
                size="small"
              >
                Get API Key
              </Button>
            }
            sx={{ mb: 3 }}
          />

          {/* API Endpoints */}
          <Stack spacing={2}>
            {filteredEndpoints.map((endpoint) => (
              <Fade in key={endpoint.id}>
                <Card
                  hover
                  sx={{
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Endpoint Header */}
                    <Box
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: { xs: 1, sm: 0 },
                        mb: expandedEndpoint === endpoint.id ? 2 : 0,
                      }}
                      onClick={() => setExpandedEndpoint(
                        expandedEndpoint === endpoint.id ? null : endpoint.id
                      )}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, width: '100%' }}>
                        <Chip
                          label={endpoint.method}
                          size="small"
                          sx={{
                            backgroundColor: getMethodColor(endpoint.method),
                            color: 'white',
                            fontWeight: 600,
                            minWidth: 70,
                          }}
                        />
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="h6" 
                            fontWeight={600}
                            sx={{ 
                              mb: 0.5,
                              wordBreak: 'break-word'
                            }}
                          >
                            {endpoint.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {endpoint.description}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' }
                      }}>
                        <Chip
                          label={endpoint.category}
                          size="small"
                          variant="outlined"
                        />
                        
                        {endpoint.requiresAuth && (
                          <Tooltip title="Requires authentication">
                            <Lock sx={{ color: '#fbbc04' }} />
                          </Tooltip>
                        )}
                        
                        <ExpandMore
                          sx={{
                            transform: expandedEndpoint === endpoint.id ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Expanded Content */}
                    <Collapse in={expandedEndpoint === endpoint.id}>
                      <Divider sx={{ my: 2 }} />

                      {/* Path */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Endpoint
                        </Typography>
                        
                        <Card
                          hover
                          sx={{
                            p: 2,
                            backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                            fontFamily: 'monospace',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            overflow: 'auto',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            <span style={{ 
                              color: getMethodColor(endpoint.method), 
                              fontWeight: 600,
                              minWidth: 50
                            }}>
                              {endpoint.method}
                            </span>
                            
                            <span style={{ 
                              marginLeft: 8,
                              flex: 1,
                              wordBreak: 'break-all'
                            }}>
                              https://api.accumamanage.com{endpoint.path}
                            </span>
                          </Box>
                          
                          <Tooltip title="Copy endpoint">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopy(`https://api.accumamanage.com${endpoint.path}`)}
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                        </Card>
                      </Box>

                      {/* Parameters */}
                      {endpoint.parameters && endpoint.parameters.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Parameters
                          </Typography>
                          
                          <Card sx={{ overflow: 'auto' }}>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 0.5,
                                p: 1.5,
                                backgroundColor: alpha('#4285f4', 0.1),
                                borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                                minWidth: 'fit-content',
                              }}
                            >
                              <Typography variant="caption" fontWeight={600}>
                                Name
                              </Typography>
                              <Typography variant="caption" fontWeight={600}>
                                Type
                              </Typography>
                              <Typography variant="caption" fontWeight={600}>
                                Required
                              </Typography>
                              <Typography variant="caption" fontWeight={600}>
                                Description
                              </Typography>
                            </Box>
                            
                            {endpoint.parameters.map((param, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(4, 1fr)',
                                  gap: 0.5,
                                  p: 1.5,
                                  borderBottom: index < endpoint.parameters!.length - 1 
                                    ? `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` 
                                    : 'none',
                                  minWidth: 'fit-content',
                                  '&:hover': {
                                    backgroundColor: alpha('#000000', darkMode ? 0.05 : 0.02),
                                  },
                                }}
                              >
                                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                  {param.name}
                                </Typography>
                                
                                <Typography variant="caption" color="text.secondary">
                                  {param.type}
                                </Typography>
                                
                                <Typography variant="caption" color={param.required ? '#ea4335' : '#34a853'}>
                                  {param.required ? 'Yes' : 'No'}
                                </Typography>
                                
                                <Typography variant="caption" color="text.secondary">
                                  {param.description}
                                </Typography>
                              </Box>
                            ))}
                          </Card>
                        </Box>
                      )}

                      {/* Examples */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3 
                      }}>
                        {endpoint.exampleRequest && (
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Example Request
                            </Typography>
                            
                            <Card
                              hover
                              sx={{
                                p: 2,
                                backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                position: 'relative',
                                maxHeight: 200,
                                overflow: 'auto',
                              }}
                            >
                              {endpoint.exampleRequest}
                              
                              <Tooltip title="Copy example">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8 
                                  }}
                                  onClick={() => handleCopy(endpoint.exampleRequest!)}
                                >
                                  <ContentCopy />
                                </IconButton>
                              </Tooltip>
                            </Card>
                          </Box>
                        )}

                        {endpoint.exampleResponse && (
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Example Response
                            </Typography>
                            
                            <Card
                              hover
                              sx={{
                                p: 2,
                                backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                position: 'relative',
                                maxHeight: 200,
                                overflow: 'auto',
                              }}
                            >
                              {endpoint.exampleResponse}
                              
                              <Tooltip title="Copy example">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8 
                                  }}
                                  onClick={() => handleCopy(endpoint.exampleResponse!)}
                                >
                                  <ContentCopy />
                                </IconButton>
                              </Tooltip>
                            </Card>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                </Card>
              </Fade>
            ))}
          </Stack>

          {/* No Results */}
          {filteredEndpoints.length === 0 && (
            <Card sx={{ 
              textAlign: 'center', 
              py: 6,
              px: 3,
              mt: 4,
              backgroundColor: darkMode ? '#303134' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <Code sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
              
              <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                No APIs Found
              </Typography>
              
              <Typography variant="body2" sx={{ 
                mb: 3,
                maxWidth: 500,
                mx: 'auto',
                color: darkMode ? '#9aa0a6' : '#5f6368',
              }}>
                Try adjusting your search or filter criteria
              </Typography>
              
              <Button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                variant="outlined"
                sx={{
                  borderColor: darkMode ? '#3c4043' : '#dadce0',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}

          {/* API Usage Notes */}
          <Card
            title="📋 API Usage Notes"
            subtitle="Important information for API consumers"
            hover
            sx={{
              mt: 4,
              backgroundColor: darkMode ? '#202124' : '#ffffff',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              mt: 2,
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  🔑 Authentication
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Include API key in header: <code>Authorization: Bearer YOUR_API_KEY</code>
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  ⚡ Rate Limiting
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  100 requests per minute per API key
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                  🛡️ Error Handling
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Returns JSON with status code and error message
                </Typography>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </MainLayout>
  );
}