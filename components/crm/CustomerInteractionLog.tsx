'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  TextField,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
  Stack,
  Divider,
  alpha,
  Badge,
  CircularProgress,
  Alert,
  InputAdornment,
  Rating,
  Tab,
  Tabs,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Phone,
  Email,
  WhatsApp,
  Message,
  Notes,
  CalendarToday,
  MoreVert,
  Edit,
  Delete,
  Refresh,
  Send,
  AttachFile,
  Mic,
  Videocam,
  CheckCircle,
  Cancel,
  Schedule,
  ThumbUp,
  ThumbDown,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  FilterList,
  Search,
  Close,
  Add
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { CustomerInteraction } from '@/types/crm';
import { useAuth } from '@/hooks/useAuth';

interface CustomerInteractionLogProps {
  customerId: string;
  customerName?: string;
}

export default function CustomerInteractionLog({ customerId, customerName }: CustomerInteractionLogProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { user } = useAuth();
  
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<CustomerInteraction | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState({
    type: 'call' as CustomerInteraction['type'],
    direction: 'outbound' as 'inbound' | 'outbound',
    subject: '',
    content: '',
    duration: 0,
    outcome: 'successful' as any,
    followUpDate: '',
    sentiment: 'neutral' as any,
    assignedTo: user?.id || ''
  });

  // Fetch interactions
  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${customerId}/interactions`);
      const data = await response.json();
      
      if (response.ok) {
        setInteractions(data.interactions || []);
      } else {
        throw new Error(data.message || 'Failed to load interactions');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [customerId]);

  // Save interaction
  const handleSave = async () => {
    try {
      const url = editingInteraction
        ? `/api/customers/interactions/${editingInteraction._id}`
        : `/api/customers/${customerId}/interactions`;
      
      const method = editingInteraction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerId,
          customerName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchInteractions();
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save interaction');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete interaction
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interaction?')) return;
    
    try {
      const response = await fetch(`/api/customers/interactions/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchInteractions();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'call',
      direction: 'outbound',
      subject: '',
      content: '',
      duration: 0,
      outcome: 'successful',
      followUpDate: '',
      sentiment: 'neutral',
      assignedTo: user?.id || ''
    });
    setEditingInteraction(null);
  };

  const handleEdit = (interaction: CustomerInteraction) => {
    setEditingInteraction(interaction);
    setFormData({
      type: interaction.type,
      direction: interaction.direction || 'outbound',
      subject: interaction.subject,
      content: interaction.content,
      duration: interaction.duration || 0,
      outcome: interaction.outcome || 'successful',
      followUpDate: interaction.followUpDate || '',
      sentiment: interaction.sentiment || 'neutral',
      assignedTo: interaction.assignedTo || user?.id || ''
    });
    setDialogOpen(true);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone />;
      case 'email': return <Email />;
      case 'whatsapp': return <WhatsApp />;
      case 'sms': return <Message />;
      case 'meeting': return <Videocam />;
      default: return <Notes />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'call': return '#4285f4';
      case 'email': return '#34a853';
      case 'whatsapp': return '#25D366';
      case 'sms': return '#fbbc04';
      case 'meeting': return '#ea4335';
      default: return '#8e44ad';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbUp sx={{ fontSize: 14, color: '#34a853' }} />;
      case 'negative': return <ThumbDown sx={{ fontSize: 14, color: '#ea4335' }} />;
      default: return <SentimentSatisfied sx={{ fontSize: 14, color: '#fbbc04' }} />;
    }
  };

  // Filter interactions
  const filteredInteractions = interactions.filter(i => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return i.subject?.toLowerCase().includes(search) || 
             i.content?.toLowerCase().includes(search);
    }
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

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
          <Notes sx={{ color: '#4285f4' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
            Interaction History
          </Typography>
          <Chip 
            label={`${interactions.length} total`}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchInteractions}>
              <Refresh />
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
            Log Interaction
          </Button>
        </Box>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search interactions..."
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
          sx={{ flex: 1 }}
        />
        <Tooltip title="Filter">
          <IconButton 
            size="small"
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              backgroundColor: filterType !== 'all' ? alpha('#4285f4', 0.1) : 'transparent',
              border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}
          >
            <FilterList />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem onClick={() => { setFilterType('all'); setFilterAnchor(null); }}>
          <ListItemText>All Interactions</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setFilterType('call'); setFilterAnchor(null); }}>
          <ListItemIcon><Phone fontSize="small" /></ListItemIcon>
          <ListItemText>Calls</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('email'); setFilterAnchor(null); }}>
          <ListItemIcon><Email fontSize="small" /></ListItemIcon>
          <ListItemText>Emails</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('whatsapp'); setFilterAnchor(null); }}>
          <ListItemIcon><WhatsApp fontSize="small" /></ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('meeting'); setFilterAnchor(null); }}>
          <ListItemIcon><Videocam fontSize="small" /></ListItemIcon>
          <ListItemText>Meetings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setFilterType('note'); setFilterAnchor(null); }}>
          <ListItemIcon><Notes fontSize="small" /></ListItemIcon>
          <ListItemText>Notes</ListItemText>
        </MenuItem>
      </Menu>

      {/* Interactions List */}
      <Box sx={{ 
        maxHeight: 400, 
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: darkMode ? '#3c4043' : '#f1f3f4' },
        '&::-webkit-scrollbar-thumb': { background: darkMode ? '#9aa0a6' : '#5f6368', borderRadius: '4px' }
      }}>
        {filteredInteractions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Notes sx={{ fontSize: 48, color: darkMode ? '#5f6368' : '#9aa0a6', opacity: 0.5, mb: 1 }} />
            <Typography color={darkMode ? '#9aa0a6' : '#5f6368'}>
              {searchTerm || filterType !== 'all' ? 'No matching interactions' : 'No interactions logged yet'}
            </Typography>
            <Button 
              variant="text" 
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              Log First Interaction
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {filteredInteractions.map((interaction) => (
              <Paper
                key={interaction._id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: darkMode ? '#303134' : '#ffffff',
                  }
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(getInteractionColor(interaction.type), 0.1),
                      color: getInteractionColor(interaction.type),
                    }}
                  >
                    {getInteractionIcon(interaction.type)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: darkMode ? '#e8eaed' : '#202124' }}>
                          {interaction.subject}
                        </Typography>
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {format(new Date(interaction.createdAt), 'dd MMM yyyy, hh:mm a')}
                          {interaction.duration && ` • ${interaction.duration} min`}
                          {interaction.direction && ` • ${interaction.direction}`}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {interaction.sentiment && (
                          <Tooltip title={`Sentiment: ${interaction.sentiment}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getSentimentIcon(interaction.sentiment)}
                            </Box>
                          </Tooltip>
                        )}
                        
                        <Chip
                          label={interaction.type}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: alpha(getInteractionColor(interaction.type), 0.1),
                            color: getInteractionColor(interaction.type),
                          }}
                        />
                        
                        <Chip
                          label={interaction.outcome}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: interaction.outcome === 'successful' 
                              ? alpha('#34a853', 0.1)
                              : interaction.outcome === 'failed'
                              ? alpha('#ea4335', 0.1)
                              : alpha('#fbbc04', 0.1),
                            color: interaction.outcome === 'successful'
                              ? '#34a853'
                              : interaction.outcome === 'failed'
                              ? '#ea4335'
                              : '#fbbc04',
                          }}
                        />
                        
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            const menu = document.createElement('div');
                            // Add menu logic here
                          }}
                        >
                          <MoreVert sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 1, 
                        color: darkMode ? '#e8eaed' : '#202124',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {interaction.content}
                    </Typography>
                    
                    {interaction.followUpDate && !interaction.followUpCompleted && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5, 
                          mt: 1,
                          p: 0.5,
                          px: 1,
                          borderRadius: 1,
                          bgcolor: alpha('#fbbc04', 0.1),
                          border: `1px solid ${alpha('#fbbc04', 0.2)}`,
                        }}
                      >
                        <Schedule sx={{ fontSize: 14, color: '#fbbc04' }} />
                        <Typography variant="caption" sx={{ color: '#fbbc04', fontWeight: 500 }}>
                          Follow-up: {format(new Date(interaction.followUpDate), 'dd MMM yyyy')}
                        </Typography>
                      </Box>
                    )}
                    
                    {interaction.attachments && interaction.attachments.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {interaction.attachments.map((file, i) => (
                          <Chip
                            key={i}
                            icon={<AttachFile sx={{ fontSize: 14 }} />}
                            label={file.name}
                            size="small"
                            onClick={() => window.open(file.url)}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                        By: {interaction.userName || 'Unknown'}
                      </Typography>
                      {interaction.assignedTo && (
                        <Chip
                          label={`Assigned to: ${interaction.assignedToName || interaction.assignedTo}`}
                          size="small"
                          sx={{ fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          px: 3,
          py: 2
        }}>
          <Typography variant="h6" fontWeight={600}>
            {editingInteraction ? 'Edit Interaction' : 'Log New Interaction'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Interaction Type */}
            <FormControl fullWidth size="small">
              <InputLabel>Interaction Type</InputLabel>
              <Select
                value={formData.type}
                label="Interaction Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <MenuItem value="call">📞 Call</MenuItem>
                <MenuItem value="email">📧 Email</MenuItem>
                <MenuItem value="whatsapp">💬 WhatsApp</MenuItem>
                <MenuItem value="sms">📱 SMS</MenuItem>
                <MenuItem value="meeting">🎥 Meeting</MenuItem>
                <MenuItem value="note">📝 Note</MenuItem>
              </Select>
            </FormControl>

            {/* Direction & Duration - Only for calls */}
            {formData.type === 'call' && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Direction</InputLabel>
                  <Select
                    value={formData.direction}
                    label="Direction"
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value as any })}
                  >
                    <MenuItem value="inbound">⬇️ Inbound</MenuItem>
                    <MenuItem value="outbound">⬆️ Outbound</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  size="small"
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </Box>
            )}

            {/* Subject */}
            <TextField
              fullWidth
              size="small"
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />

            {/* Content */}
            <Box>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 0.5, display: 'block' }}>
                Details
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Write the interaction details here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  backgroundColor: darkMode ? '#202124' : '#ffffff',
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </Box>

            {/* Outcome & Sentiment */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Outcome</InputLabel>
                <Select
                  value={formData.outcome}
                  label="Outcome"
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value as any })}
                >
                  <MenuItem value="successful">✅ Successful</MenuItem>
                  <MenuItem value="failed">❌ Failed</MenuItem>
                  <MenuItem value="followup_required">📅 Follow-up Required</MenuItem>
                  <MenuItem value="no_answer">📵 No Answer</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Sentiment</InputLabel>
                <Select
                  value={formData.sentiment}
                  label="Sentiment"
                  onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as any })}
                >
                  <MenuItem value="positive">😊 Positive</MenuItem>
                  <MenuItem value="neutral">😐 Neutral</MenuItem>
                  <MenuItem value="negative">😞 Negative</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Follow-up Date */}
            <TextField
              fullWidth
              size="small"
              label="Follow-up Date"
              type="datetime-local"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            {/* Attachments - Placeholder */}
            <Button
              variant="outlined"
              startIcon={<AttachFile />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Attach Files
            </Button>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ 
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          px: 3,
          py: 2,
          gap: 1
        }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            startIcon={<Send />}
            disabled={!formData.subject || !formData.content}
            sx={{
              backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
              color: darkMode ? '#202124' : '#ffffff',
            }}
          >
            {editingInteraction ? 'Update' : 'Save Interaction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}