'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  alpha,
  Avatar,
  Badge,
  LinearProgress,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Slider,
  Grid
} from '@mui/material';
import {
  PersonAdd,
  Search,
  Close,
  FilterList,
  Refresh,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Phone,
  Email,
  WhatsApp,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Timeline,
  Add,
  AssignmentTurnedIn,
  Schedule,
  Flag,
  Business,
  LocationOn,
  Source,
  Star,
  StarBorder
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { Lead } from '@/types/crm';
import { useRouter } from 'next/navigation';

interface LeadManagementProps {
  initialStatus?: string;
}

export default function LeadManagement({ initialStatus = 'new' }: LeadManagementProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    source: 'website' as Lead['source'],
    status: 'new' as Lead['status'],
    stage: 'cold' as Lead['stage'],
    expectedValue: 0,
    probability: 50,
    assignedTo: '',
    nextFollowUp: '',
    notes: '',
    tags: [] as string[]
  });

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (stageFilter !== 'all') params.append('stage', stageFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setLeads(data.leads || []);
      } else {
        throw new Error(data.message || 'Failed to load leads');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, stageFilter, sourceFilter, searchTerm]);

  // Save lead
  const handleSave = async () => {
    try {
      const url = editingLead
        ? `/api/leads/${editingLead._id}`
        : '/api/leads';
      
      const method = editingLead ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchLeads();
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save lead');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Convert lead to customer
  const handleConvert = async () => {
    if (!selectedLead) return;
    
    try {
      const response = await fetch(`/api/leads/${selectedLead._id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          convertedBy: 'current_user_id' // Replace with actual user ID
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchLeads();
        setConvertDialogOpen(false);
        setMenuAnchor(null);
        
        // Redirect to new customer page
        if (data.customerId) {
          router.push(`/customers/${data.customerId}`);
        }
      } else {
        throw new Error(data.message || 'Failed to convert lead');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete lead
  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchLeads();
        setMenuAnchor(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      address: '',
      source: 'website',
      status: 'new',
      stage: 'cold',
      expectedValue: 0,
      probability: 50,
      assignedTo: '',
      nextFollowUp: '',
      notes: '',
      tags: []
    });
    setEditingLead(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#4285f4';
      case 'contacted': return '#8ab4f8';
      case 'qualified': return '#34a853';
      case 'proposal': return '#fbbc04';
      case 'negotiation': return '#ea4335';
      case 'won': return '#34a853';
      case 'lost': return '#5f6368';
      default: return '#5f6368';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'cold': return '#4285f4';
      case 'warm': return '#fbbc04';
      case 'hot': return '#ea4335';
      default: return '#5f6368';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return <Source />;
      case 'referral': return <Star />;
      case 'walk_in': return <PersonAdd />;
      case 'call': return <Phone />;
      case 'social_media': return <WhatsApp />;
      case 'email_marketing': return <Email />;
      default: return <Source />;
    }
  };

  // Statistics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.expectedValue, 0);
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  // Group by stage
  const coldLeads = leads.filter(l => l.stage === 'cold').length;
  const warmLeads = leads.filter(l => l.stage === 'warm').length;
  const hotLeads = leads.filter(l => l.stage === 'hot').length;

  return (
    <Paper sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ color: '#4285f4' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
            Lead Management
          </Typography>
          <Chip 
            label={`${totalLeads} leads`}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchLeads}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            sx={{
              borderRadius: '20px',
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
            }}
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Paper sx={{
          p: 1.5,
          borderRadius: 2,
          flex: 1,
          minWidth: 120,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Pipeline Value
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
            ₹{totalValue.toLocaleString()}
          </Typography>
        </Paper>
        
        <Paper sx={{
          p: 1.5,
          borderRadius: 2,
          flex: 1,
          minWidth: 120,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Conversion Rate
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#34a853' }}>
            {conversionRate}%
          </Typography>
        </Paper>
        
        <Paper sx={{
          p: 1.5,
          borderRadius: 2,
          flex: 1,
          minWidth: 120,
          backgroundColor: darkMode ? '#202124' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Won Deals
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#34a853' }}>
            {wonLeads}
          </Typography>
        </Paper>
      </Box>

      {/* Stage Distribution */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          icon={<StarBorder />}
          label={`Cold: ${coldLeads}`}
          sx={{
            backgroundColor: alpha('#4285f4', 0.1),
            color: '#4285f4',
          }}
        />
        <Chip
          icon={<Star />}
          label={`Warm: ${warmLeads}`}
          sx={{
            backgroundColor: alpha('#fbbc04', 0.1),
            color: '#fbbc04',
          }}
        />
        <Chip
          icon={<TrendingUp />}
          label={`Hot: ${hotLeads}`}
          sx={{
            backgroundColor: alpha('#ea4335', 0.1),
            color: '#ea4335',
          }}
        />
      </Box>

      {/* Search & Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search leads by name, phone, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            )
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="qualified">Qualified</MenuItem>
            <MenuItem value="proposal">Proposal</MenuItem>
            <MenuItem value="negotiation">Negotiation</MenuItem>
            <MenuItem value="won">Won</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Stage</InputLabel>
          <Select
            value={stageFilter}
            label="Stage"
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <MenuItem value="all">All Stages</MenuItem>
            <MenuItem value="cold">Cold</MenuItem>
            <MenuItem value="warm">Warm</MenuItem>
            <MenuItem value="hot">Hot</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={sourceFilter}
            label="Source"
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <MenuItem value="all">All Sources</MenuItem>
            <MenuItem value="website">Website</MenuItem>
            <MenuItem value="referral">Referral</MenuItem>
            <MenuItem value="walk_in">Walk-in</MenuItem>
            <MenuItem value="call">Call</MenuItem>
            <MenuItem value="social_media">Social Media</MenuItem>
            <MenuItem value="email_marketing">Email</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Leads Table */}
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <TableContainer sx={{ 
          maxHeight: 500,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: darkMode ? '#3c4043' : '#f1f3f4' },
          '&::-webkit-scrollbar-thumb': { background: darkMode ? '#9aa0a6' : '#5f6368', borderRadius: '4px' }
        }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Lead</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Stage/Status</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Next Follow-up</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <PersonAdd sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 1 }} />
                    <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
                      No leads found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow 
                    key={lead._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => router.push(`/customers/leads/${lead._id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: alpha(getStageColor(lead.stage), 0.1),
                            color: getStageColor(lead.stage),
                          }}
                        >
                          {lead.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {lead.name}
                          </Typography>
                          {lead.company && (
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                              {lead.company}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone sx={{ fontSize: 12 }} />
                          {lead.phone}
                        </Typography>
                        {lead.email && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email sx={{ fontSize: 12 }} />
                            {lead.email}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        icon={React.cloneElement(getSourceIcon(lead.source), { sx: { fontSize: 14 } })}
                        label={lead.source.replace('_', ' ')}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.7rem',
                          backgroundColor: alpha('#4285f4', 0.1),
                          color: '#4285f4',
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip
                          label={lead.stage}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            backgroundColor: alpha(getStageColor(lead.stage), 0.1),
                            color: getStageColor(lead.stage),
                            textTransform: 'capitalize',
                          }}
                        />
                        <Chip
                          label={lead.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                            color: getStatusColor(lead.status),
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }}>
                        ₹{lead.expectedValue.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        {lead.probability}%
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      {lead.nextFollowUp ? (
                        <Box>
                          <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                            {format(new Date(lead.nextFollowUp), 'dd MMM')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', display: 'block' }}>
                            {format(new Date(lead.nextFollowUp), 'hh:mm a')}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          Not set
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setMenuAnchor(e.currentTarget);
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Lead Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          if (selectedLead) {
            setFormData({
              name: selectedLead.name,
              phone: selectedLead.phone,
              email: selectedLead.email || '',
              company: selectedLead.company || '',
              address: selectedLead.address || '',
              source: selectedLead.source,
              status: selectedLead.status,
              stage: selectedLead.stage,
              expectedValue: selectedLead.expectedValue,
              probability: selectedLead.probability,
              assignedTo: selectedLead.assignedTo,
              nextFollowUp: selectedLead.nextFollowUp?.slice(0, 16) || '',
              notes: selectedLead.notes || '',
              tags: selectedLead.tags || []
            });
            setEditingLead(selectedLead);
            setDialogOpen(true);
            setMenuAnchor(null);
          }
        }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Lead</ListItemText>
        </MenuItem>
        
        {selectedLead?.status !== 'won' && selectedLead?.status !== 'lost' && (
          <MenuItem onClick={() => {
            setConvertDialogOpen(true);
            setMenuAnchor(null);
          }}>
            <ListItemIcon><AssignmentTurnedIn fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon>
            <ListItemText>Convert to Customer</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        {selectedLead?.status === 'won' ? (
          <MenuItem disabled>
            <ListItemIcon><CheckCircle fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon>
            <ListItemText>Already Won</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={async () => {
            if (selectedLead) {
              await fetch(`/api/leads/${selectedLead._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'won' })
              });
              fetchLeads();
              setMenuAnchor(null);
            }
          }}>
            <ListItemIcon><CheckCircle fontSize="small" sx={{ color: '#34a853' }} /></ListItemIcon>
            <ListItemText>Mark as Won</ListItemText>
          </MenuItem>
        )}
        
        {selectedLead?.status === 'lost' ? (
          <MenuItem disabled>
            <ListItemIcon><Cancel fontSize="small" sx={{ color: '#ea4335' }} /></ListItemIcon>
            <ListItemText>Already Lost</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={async () => {
            if (selectedLead) {
              const reason = prompt('Why did you lose this lead?');
              await fetch(`/api/leads/${selectedLead._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'lost',
                  lostReason: reason,
                  lostAt: new Date().toISOString()
                })
              });
              fetchLeads();
              setMenuAnchor(null);
            }
          }}>
            <ListItemIcon><Cancel fontSize="small" sx={{ color: '#ea4335' }} /></ListItemIcon>
            <ListItemText>Mark as Lost</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={() => {
          if (selectedLead) {
            handleDelete(selectedLead._id);
          }
        }} sx={{ color: '#ea4335' }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: '#ea4335' }} /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Lead Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            {editingLead ? 'Edit Lead' : 'Add New Lead'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Typography variant="subtitle2" fontWeight={600}>Basic Information</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                size="small"
                label="Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </Box>
            
            <TextField
              fullWidth
              size="small"
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            
            <Divider />
            
            {/* Lead Details */}
            <Typography variant="subtitle2" fontWeight={600}>Lead Details</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Source *</InputLabel>
                <Select
                  value={formData.source}
                  label="Source *"
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                >
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="walk_in">Walk-in</MenuItem>
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="social_media">Social Media</MenuItem>
                  <MenuItem value="email_marketing">Email Marketing</MenuItem>
                  <MenuItem value="sms_campaign">SMS Campaign</MenuItem>
                  <MenuItem value="exhibition">Exhibition</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Status *</InputLabel>
                <Select
                  value={formData.status}
                  label="Status *"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="qualified">Qualified</MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="negotiation">Negotiation</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Stage *</InputLabel>
                <Select
                  value={formData.stage}
                  label="Stage *"
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                >
                  <MenuItem value="cold">Cold</MenuItem>
                  <MenuItem value="warm">Warm</MenuItem>
                  <MenuItem value="hot">Hot</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  label="Assigned To"
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <MenuItem value="current_user">Myself</MenuItem>
                  {/* Add other users here */}
                </Select>
              </FormControl>
            </Box>
            
            <Divider />
            
            {/* Deal Information */}
            <Typography variant="subtitle2" fontWeight={600}>Deal Information</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Expected Value (₹)"
                type="number"
                value={formData.expectedValue}
                onChange={(e) => setFormData({ ...formData, expectedValue: parseInt(e.target.value) || 0 })}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  Probability: {formData.probability}%
                </Typography>
                <Slider
                  value={formData.probability}
                  onChange={(_, value) => setFormData({ ...formData, probability: value as number })}
                  step={5}
                  marks
                  min={0}
                  max={100}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <TextField
              fullWidth
              size="small"
              label="Next Follow-up Date"
              type="datetime-local"
              value={formData.nextFollowUp}
              onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            
            <Divider />
            
            {/* Additional Information */}
            <Typography variant="subtitle2" fontWeight={600}>Additional Information</Typography>
            
            <TextField
              fullWidth
              size="small"
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this lead..."
            />
            
            <TextField
              fullWidth
              size="small"
              label="Tags (comma separated)"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              placeholder="vip, wholesale, urgent"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name || !formData.phone}
            sx={{
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
            }}
          >
            {editingLead ? 'Update Lead' : 'Save Lead'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Convert to Customer Dialog */}
      <Dialog
        open={convertDialogOpen}
        onClose={() => setConvertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#34a853' }}>
            Convert Lead to Customer
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              This lead will be converted to a customer and moved to the customer database.
            </Alert>
            
            {selectedLead && (
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: alpha('#34a853', 0.1), color: '#34a853' }}>
                    {selectedLead.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedLead.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      {selectedLead.phone} • {selectedLead.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Expected Value:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{selectedLead.expectedValue.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    Probability:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedLead.probability}%
                  </Typography>
                </Box>
              </Paper>
            )}
            
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              This action will:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Create a new customer profile
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Move all lead information to customer
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Mark this lead as "Won"
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                Redirect to the new customer page
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setConvertDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConvert}
            variant="contained"
            startIcon={<AssignmentTurnedIn />}
            sx={{
              backgroundColor: '#34a853',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2d9248',
              },
            }}
          >
            Convert to Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}