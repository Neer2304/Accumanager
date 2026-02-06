// app/api/page.tsx
"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Paper,
  Divider,
  Chip,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
  Alert,
  Tooltip,
  alpha,
  Fade,
  Grid,
  useMediaQuery as useMuiMediaQuery,
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
} from '@mui/icons-material';
import { MainLayout } from '@/components/Layout/MainLayout';
import Link from 'next/link';

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
  const isXS = useMediaQuery(theme.breakpoints.down('xs'));
  const isSM = useMediaQuery(theme.breakpoints.down('sm'));
  const isMD = useMediaQuery(theme.breakpoints.down('md'));
  const isLG = useMediaQuery(theme.breakpoints.down('lg'));
  
  const getResponsiveTypography = (xs: string, sm: string, md: string, lg: string) => {
    if (isXS) return xs;
    if (isSM) return sm;
    if (isMD) return md;
    return lg;
  };

  const getGridColumns = () => {
    if (isXS) return 1;
    if (isSM) return 2;
    if (isMD) return 3;
    return 4;
  };

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
      case 'GET': return theme.palette.success.main;
      case 'POST': return theme.palette.info.main;
      case 'PUT': return theme.palette.warning.main;
      case 'DELETE': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
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
      <Container maxWidth="lg" sx={{ 
        py: isXS ? 1 : isSM ? 2 : 3,
        px: isXS ? 1 : isSM ? 2 : 3 
      }}>
        {/* Header */}
        <Box sx={{ mb: isXS ? 2 : isSM ? 3 : 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            sx={{ 
              fontSize: getResponsiveTypography('1.5rem', '1.75rem', '2rem', '2.25rem'),
              mb: isXS ? 1 : 2 
            }}
          >
            API Documentation
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: isXS ? 2 : 3,
              fontSize: getResponsiveTypography('0.85rem', '0.9rem', '1rem', '1.05rem')
            }}
          >
            Documentation for all available REST APIs in AccumaManage
          </Typography>

          {/* Quick Stats */}
          <Grid 
            container 
            spacing={isXS ? 1 : 2} 
            sx={{ mb: isXS ? 2 : 3 }}
          >
            <Grid item xs={12} sm={4}>
              <Paper sx={{ 
                p: isXS ? 1.5 : 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: isXS ? 1 : 2,
                height: '100%'
              }}>
                <Http sx={{ 
                  color: 'primary.main',
                  fontSize: getResponsiveTypography('20px', '22px', '24px', '26px')
                }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                    }}
                  >
                    Total Endpoints
                  </Typography>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: getResponsiveTypography('1.1rem', '1.2rem', '1.3rem', '1.4rem')
                    }}
                  >
                    {endpoints.length}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper sx={{ 
                p: isXS ? 1.5 : 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: isXS ? 1 : 2,
                height: '100%'
              }}>
                <Security sx={{ 
                  color: 'success.main',
                  fontSize: getResponsiveTypography('20px', '22px', '24px', '26px')
                }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                    }}
                  >
                    Requires Auth
                  </Typography>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: getResponsiveTypography('1.1rem', '1.2rem', '1.3rem', '1.4rem')
                    }}
                  >
                    {endpoints.filter(e => e.requiresAuth).length}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper sx={{ 
                p: isXS ? 1.5 : 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: isXS ? 1 : 2,
                height: '100%'
              }}>
                <Speed sx={{ 
                  color: 'info.main',
                  fontSize: getResponsiveTypography('20px', '22px', '24px', '26px')
                }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                    }}
                  >
                    Categories
                  </Typography>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontSize: getResponsiveTypography('1.1rem', '1.2rem', '1.3rem', '1.4rem')
                    }}
                  >
                    {categories.length - 1}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{ 
            p: isXS ? 1.5 : 2, 
            mb: isXS ? 2 : 3 
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={isXS ? 1.5 : 2} 
              alignItems="center"
            >
              <TextField
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <Search sx={{ 
                    mr: 1, 
                    color: 'text.secondary',
                    fontSize: getResponsiveTypography('18px', '20px', '22px', '24px')
                  }} />,
                }}
                inputProps={{
                  style: {
                    fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                  }
                }}
              />
              
              <TextField
                select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="small"
                sx={{ 
                  minWidth: isXS ? '100%' : isSM ? 120 : 150 
                }}
                InputProps={{
                  startAdornment: <FilterList sx={{ 
                    mr: 1, 
                    color: 'text.secondary',
                    fontSize: getResponsiveTypography('18px', '20px', '22px', '24px')
                  }} />,
                }}
                SelectProps={{
                  sx: {
                    fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem 
                    key={category.value} 
                    value={category.value}
                    sx={{ 
                      fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                    }}
                  >
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>

          {/* Getting Started Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: isXS ? 2 : 3,
              py: isXS ? 1 : 1.5,
              fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem')
            }}
            action={
              <Button 
                component={Link} 
                href="/dashboard/settings/api" 
                size="small"
                color="inherit"
                sx={{ 
                  fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem'),
                  py: isXS ? 0.5 : 0.75
                }}
              >
                Get API Key
              </Button>
            }
          >
            All API requests require authentication. Get your API key from Settings.
          </Alert>
        </Box>

        {/* API Endpoints */}
        <Stack spacing={isXS ? 2 : 3}>
          {filteredEndpoints.map((endpoint) => (
            <Fade in key={endpoint.id}>
              <Card sx={{ 
                borderRadius: isXS ? 8 : 12,
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: '0 !important' }}>
                  {/* Endpoint Header */}
                  <Box
                    sx={{
                      p: isXS ? 2 : 3,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: isXS ? 'column' : 'row',
                      alignItems: isXS ? 'flex-start' : 'center',
                      justifyContent: 'space-between',
                      gap: isXS ? 1 : 0,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.04),
                      },
                    }}
                    onClick={() => setExpandedEndpoint(
                      expandedEndpoint === endpoint.id ? null : endpoint.id
                    )}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: isXS ? 1 : 2, 
                      flex: 1,
                      width: '100%'
                    }}>
                      <Chip
                        label={endpoint.method}
                        size={isXS ? "small" : "medium"}
                        sx={{
                          backgroundColor: getMethodColor(endpoint.method),
                          color: 'white',
                          fontWeight: 600,
                          minWidth: isXS ? 55 : 70,
                          height: isXS ? 24 : 32,
                          fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                        }}
                      />
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant={isXS ? "subtitle1" : "h6"} 
                          fontWeight={600}
                          sx={{ 
                            fontSize: getResponsiveTypography('0.9rem', '1rem', '1.1rem', '1.2rem'),
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
                            fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem'),
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
                      gap: isXS ? 0.5 : 1,
                      mt: isXS ? 1 : 0,
                      width: isXS ? '100%' : 'auto'
                    }}>
                      <Chip
                        label={endpoint.category}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: getResponsiveTypography('0.65rem', '0.7rem', '0.75rem', '0.8rem'),
                          height: isXS ? 20 : 24
                        }}
                      />
                      
                      {endpoint.requiresAuth && (
                        <Tooltip title="Requires authentication">
                          <Lock sx={{ 
                            fontSize: getResponsiveTypography('14px', '16px', '18px', '20px'),
                            color: 'warning.main'
                          }} />
                        </Tooltip>
                      )}
                      
                      <ExpandMore
                        sx={{
                          transform: expandedEndpoint === endpoint.id ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s ease',
                          fontSize: getResponsiveTypography('20px', '22px', '24px', '26px')
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Expanded Content */}
                  <Collapse in={expandedEndpoint === endpoint.id}>
                    <Box sx={{ p: isXS ? 2 : 3, pt: 0 }}>
                      <Divider sx={{ my: isXS ? 1.5 : 2 }} />

                      {/* Path */}
                      <Box sx={{ mb: isXS ? 2 : 3 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          gutterBottom
                          sx={{ 
                            fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                          }}
                        >
                          Endpoint
                        </Typography>
                        
                        <Paper
                          sx={{
                            p: isXS ? 1 : 1.5,
                            backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                            fontFamily: 'monospace',
                            display: 'flex',
                            flexDirection: isXS ? 'column' : 'row',
                            alignItems: isXS ? 'flex-start' : 'center',
                            justifyContent: 'space-between',
                            gap: isXS ? 1 : 0,
                            overflow: 'auto'
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1,
                            width: isXS ? '100%' : 'auto'
                          }}>
                            <span style={{ 
                              color: getMethodColor(endpoint.method), 
                              fontWeight: 600,
                              fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem'),
                              minWidth: isXS ? 40 : 50
                            }}>
                              {endpoint.method}
                            </span>
                            
                            <span style={{ 
                              marginLeft: isXS ? 0 : 8,
                              flex: 1,
                              fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem'),
                              wordBreak: 'break-all'
                            }}>
                              https://api.accumamanage.com{endpoint.path}
                            </span>
                          </Box>
                          
                          <Tooltip title="Copy endpoint">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopy(`https://api.accumamanage.com${endpoint.path}`)}
                              sx={{ 
                                mt: isXS ? 1 : 0,
                                alignSelf: isXS ? 'flex-end' : 'center'
                              }}
                            >
                              <ContentCopy sx={{ 
                                fontSize: getResponsiveTypography('16px', '18px', '20px', '22px')
                              }} />
                            </IconButton>
                          </Tooltip>
                        </Paper>
                      </Box>

                      {/* Parameters */}
                      {endpoint.parameters && endpoint.parameters.length > 0 && (
                        <Box sx={{ mb: isXS ? 2 : 3 }}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={600} 
                            gutterBottom
                            sx={{ 
                              fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                            }}
                          >
                            Parameters
                          </Typography>
                          
                          <Paper sx={{ overflow: 'auto' }}>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                                gap: 0.5,
                                p: isXS ? 1 : 1.5,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                minWidth: 'fit-content'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                fontWeight={600}
                                sx={{ 
                                  fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                }}
                              >
                                Name
                              </Typography>
                              <Typography 
                                variant="caption" 
                                fontWeight={600}
                                sx={{ 
                                  fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                }}
                              >
                                Type
                              </Typography>
                              <Typography 
                                variant="caption" 
                                fontWeight={600}
                                sx={{ 
                                  fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                }}
                              >
                                Required
                              </Typography>
                              
                              {!isSM && (
                                <Typography 
                                  variant="caption" 
                                  fontWeight={600}
                                  sx={{ 
                                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                  }}
                                >
                                  Description
                                </Typography>
                              )}
                            </Box>
                            
                            {endpoint.parameters.map((param, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                                  gap: 0.5,
                                  p: isXS ? 1 : 1.5,
                                  borderBottom: index < endpoint.parameters!.length - 1 
                                    ? `1px solid ${theme.palette.divider}` 
                                    : 'none',
                                  minWidth: 'fit-content',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                                  },
                                }}
                              >
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    fontFamily: 'monospace',
                                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                  }}
                                >
                                  {param.name}
                                </Typography>
                                
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                  }}
                                >
                                  {param.type}
                                </Typography>
                                
                                <Typography 
                                  variant="caption" 
                                  color={param.required ? 'error.main' : 'success.main'}
                                  sx={{ 
                                    fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                  }}
                                >
                                  {param.required ? 'Yes' : 'No'}
                                </Typography>
                                
                                {!isSM && (
                                  <Typography 
                                    variant="caption" 
                                    color="text.secondary"
                                    sx={{ 
                                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                                    }}
                                  >
                                    {param.description}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Paper>
                        </Box>
                      )}

                      {/* Examples */}
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                        gap: isXS ? 2 : 3 
                      }}>
                        {endpoint.exampleRequest && (
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={600} 
                              gutterBottom
                              sx={{ 
                                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                              }}
                            >
                              Example Request
                            </Typography>
                            
                            <Paper
                              sx={{
                                p: isXS ? 1 : 1.5,
                                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                position: 'relative',
                                maxHeight: 200,
                                overflow: 'auto'
                              }}
                            >
                              <Box sx={{ 
                                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem'),
                                lineHeight: 1.5
                              }}>
                                {endpoint.exampleRequest}
                              </Box>
                              
                              <Tooltip title="Copy example">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 4, 
                                    right: 4 
                                  }}
                                  onClick={() => handleCopy(endpoint.exampleRequest!)}
                                >
                                  <ContentCopy sx={{ 
                                    fontSize: getResponsiveTypography('16px', '18px', '20px', '22px')
                                  }} />
                                </IconButton>
                              </Tooltip>
                            </Paper>
                          </Box>
                        )}

                        {endpoint.exampleResponse && (
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={600} 
                              gutterBottom
                              sx={{ 
                                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                              }}
                            >
                              Example Response
                            </Typography>
                            
                            <Paper
                              sx={{
                                p: isXS ? 1 : 1.5,
                                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                position: 'relative',
                                maxHeight: 200,
                                overflow: 'auto'
                              }}
                            >
                              <Box sx={{ 
                                fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem'),
                                lineHeight: 1.5
                              }}>
                                {endpoint.exampleResponse}
                              </Box>
                              
                              <Tooltip title="Copy example">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 4, 
                                    right: 4 
                                  }}
                                  onClick={() => handleCopy(endpoint.exampleResponse!)}
                                >
                                  <ContentCopy sx={{ 
                                    fontSize: getResponsiveTypography('16px', '18px', '20px', '22px')
                                  }} />
                                </IconButton>
                              </Tooltip>
                            </Paper>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Stack>

        {/* No Results */}
        {filteredEndpoints.length === 0 && (
          <Card sx={{ 
            textAlign: 'center', 
            py: isXS ? 4 : 6,
            px: isXS ? 2 : 3
          }}>
            <Code sx={{ 
              fontSize: getResponsiveTypography('36px', '42px', '48px', '54px'), 
              color: 'text.secondary', 
              mb: isXS ? 1.5 : 2 
            }} />
            
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.2rem', '1.3rem')
              }}
            >
              No APIs Found
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: isXS ? 2 : 3,
                fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
              }}
            >
              Try adjusting your search or filter criteria
            </Typography>
            
            <Button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              size={isXS ? "small" : "medium"}
              sx={{ 
                fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem')
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* API Usage Notes */}
        <Card sx={{ 
          mt: isXS ? 3 : 4,
          borderRadius: isXS ? 8 : 12
        }}>
          <CardContent sx={{ 
            p: isXS ? 2 : 3 
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: getResponsiveTypography('1rem', '1.1rem', '1.2rem', '1.3rem')
              }}
            >
              API Usage Notes
            </Typography>
            
            <Stack spacing={isXS ? 1.5 : 2}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: isXS ? 1 : 1.5 
              }}>
                <CheckCircle sx={{ 
                  color: 'success.main', 
                  mt: 0.25,
                  fontSize: getResponsiveTypography('18px', '20px', '22px', '24px')
                }} />
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ 
                      fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                    }}
                  >
                    Authentication
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem')
                    }}
                  >
                    Include API key in header: <code style={{ 
                      fontSize: getResponsiveTypography('0.7rem', '0.75rem', '0.8rem', '0.85rem')
                    }}>Authorization: Bearer YOUR_API_KEY</code>
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: isXS ? 1 : 1.5 
              }}>
                <CheckCircle sx={{ 
                  color: 'success.main', 
                  mt: 0.25,
                  fontSize: getResponsiveTypography('18px', '20px', '22px', '24px')
                }} />
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ 
                      fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                    }}
                  >
                    Rate Limiting
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem')
                    }}
                  >
                    100 requests per minute per API key
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: isXS ? 1 : 1.5 
              }}>
                <CheckCircle sx={{ 
                  color: 'success.main', 
                  mt: 0.25,
                  fontSize: getResponsiveTypography('18px', '20px', '22px', '24px')
                }} />
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ 
                      fontSize: getResponsiveTypography('0.8rem', '0.85rem', '0.9rem', '0.95rem')
                    }}
                  >
                    Error Handling
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: getResponsiveTypography('0.75rem', '0.8rem', '0.85rem', '0.9rem')
                    }}
                  >
                    Returns JSON with status code and error message
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
}