// components/advance/marketing/AudiencesTab.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  People,
  DynamicFeed,
  FilterList,
  Add,
  MoreVert,
  Edit,
  ContentCopy,
  Delete,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const googleColors = {
  blue: '#4285F4',
  green: '#34A853',
  yellow: '#FBBC04',
  red: '#EA4335',
};

interface AudiencesTabProps {
  segments: any[];
  currentColors: any;
  primaryColor: string;
  isMobile: boolean;
}

const AudiencesTab: React.FC<AudiencesTabProps> = ({
  segments,
  currentColors,
  primaryColor,
  isMobile,
}) => {
  const [newSegmentDialog, setNewSegmentDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, segmentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSegment(segmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSegment(null);
  };

  const handleDuplicate = () => {
    // Handle duplicate logic
    handleMenuClose();
  };

  const handleEdit = () => {
    // Handle edit logic
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedSegment && confirm('Are you sure you want to delete this segment?')) {
      // Handle delete logic
      handleMenuClose();
    }
  };

  const segmentStats = {
    totalCustomers: segments.reduce((sum, segment) => sum + segment.customerCount, 0),
    staticSegments: segments.filter(s => s.type === 'static').length,
    dynamicSegments: segments.filter(s => s.type === 'dynamic').length,
    averageSize: Math.round(segments.reduce((sum, segment) => sum + segment.customerCount, 0) / segments.length) || 0,
  };

  return (
    <Box>
      {/* Stats and Header */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, mb: 3 }}>
        {/* Stats Card */}
        <Card sx={{ 
          flex: isMobile ? '1 1 100%' : 2,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Audience Overview
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Paper sx={{ 
                flex: 1,
                minWidth: '150px',
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <Typography variant="h4" fontWeight="bold" color={primaryColor}>
                  {segmentStats.totalCustomers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Total Customers
                </Typography>
              </Paper>
              
              <Paper sx={{ 
                flex: 1,
                minWidth: '150px',
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <Typography variant="h4" fontWeight="bold" color={googleColors.green}>
                  {segmentStats.dynamicSegments}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Dynamic Segments
                </Typography>
              </Paper>
              
              <Paper sx={{ 
                flex: 1,
                minWidth: '150px',
                p: 2, 
                background: currentColors.surface,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <Typography variant="h4" fontWeight="bold" color={googleColors.blue}>
                  {segmentStats.averageSize.toLocaleString()}
                </Typography>
                <Typography variant="body2" color={currentColors.textSecondary}>
                  Avg. Segment Size
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ 
          flex: isMobile ? '1 1 100%' : 1,
          background: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          borderRadius: '12px',
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
              Quick Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNewSegmentDialog(true)}
                sx={{
                  background: primaryColor,
                  color: 'white',
                  '&:hover': {
                    background: '#3367D6',
                  }
                }}
              >
                Create New Segment
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                sx={{
                  borderColor: currentColors.border,
                  color: currentColors.textPrimary,
                  '&:hover': {
                    borderColor: primaryColor,
                    background: alpha(primaryColor, 0.04),
                  }
                }}
              >
                Duplicate Segment
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                sx={{
                  borderColor: currentColors.border,
                  color: currentColors.textPrimary,
                  '&:hover': {
                    borderColor: googleColors.green,
                    background: alpha(googleColors.green, 0.04),
                  }
                }}
              >
                Analyze Performance
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ 
        mb: 3,
        background: currentColors.card,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '12px',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterList sx={{ color: currentColors.textSecondary }} />
              <Typography variant="body2" color={currentColors.textSecondary}>
                Filter Segments
              </Typography>
            </Box>
            
            <TextField
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                maxWidth: '400px',
                '& .MuiOutlinedInput-root': {
                  background: currentColors.surface,
                  color: currentColors.textPrimary,
                },
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                clickable
                sx={{
                  background: alpha(primaryColor, 0.1),
                  color: primaryColor,
                  fontWeight: 'medium'
                }}
              />
              <Chip
                label="Dynamic"
                clickable
                sx={{
                  background: alpha(googleColors.green, 0.1),
                  color: googleColors.green,
                  fontWeight: 'medium'
                }}
              />
              <Chip
                label="Static"
                clickable
                sx={{
                  background: alpha(googleColors.blue, 0.1),
                  color: googleColors.blue,
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Segments Grid */}
      <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
        Customer Segments ({filteredSegments.length})
      </Typography>
      
      {filteredSegments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color={currentColors.textSecondary} mb={2}>
            No segments found
          </Typography>
          {searchQuery && (
            <Button
              variant="text"
              size="small"
              onClick={() => setSearchQuery('')}
              sx={{ color: primaryColor }}
            >
              Clear search
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredSegments.map((segment) => (
            <Card
              key={segment._id}
              sx={{
                flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 12px)',
                minWidth: isMobile ? '100%' : '350px',
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 4px 12px ${alpha(primaryColor, 0.1)}`,
                  borderColor: primaryColor,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {segment.type === 'dynamic' ? (
                      <DynamicFeed sx={{ color: googleColors.green }} />
                    ) : (
                      <People sx={{ color: googleColors.blue }} />
                    )}
                    <Typography variant="h6" fontWeight="medium" color={currentColors.textPrimary}>
                      {segment.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={segment.type}
                      size="small"
                      sx={{
                        background: segment.type === 'dynamic' 
                          ? alpha(googleColors.green, 0.1)
                          : alpha(googleColors.blue, 0.1),
                        color: segment.type === 'dynamic' 
                          ? googleColors.green
                          : googleColors.blue,
                        textTransform: 'capitalize',
                        fontWeight: 'medium'
                      }}
                    />
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuClick(e, segment._id)}
                      sx={{ color: currentColors.textSecondary }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Customer Count */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: alpha(primaryColor, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: primaryColor,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {segment.customerCount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color={currentColors.textSecondary}>
                        Customers
                      </Typography>
                      <Typography variant="caption" color={currentColors.textSecondary}>
                        Updated: {formatDate(segment.lastUpdated)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Growth Indicator */}
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((segment.customerCount / segmentStats.totalCustomers) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(currentColors.border, 0.3),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: primaryColor,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
                
                {/* Segment Criteria */}
                {segment.criteria && segment.criteria.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="medium" gutterBottom color={currentColors.textPrimary}>
                      Segment Criteria
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {segment.criteria.slice(0, 3).map((criterion: any, index: number) => (
                        <Typography key={index} variant="caption" color={currentColors.textSecondary}>
                          • {criterion.field} {criterion.operator} {criterion.value}
                        </Typography>
                      ))}
                      {segment.criteria.length > 3 && (
                        <Typography variant="caption" color={currentColors.textSecondary}>
                          + {segment.criteria.length - 3} more conditions
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
                
                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonAdd />}
                    fullWidth
                    sx={{
                      borderColor: currentColors.border,
                      color: currentColors.textPrimary,
                      '&:hover': {
                        borderColor: primaryColor,
                      }
                    }}
                  >
                    Add Customers
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<TrendingUp />}
                    fullWidth
                    sx={{
                      background: primaryColor,
                      color: 'white',
                      '&:hover': {
                        background: '#3367D6',
                      }
                    }}
                  >
                    Use in Campaign
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: currentColors.card,
            border: `1px solid ${currentColors.border}`,
          }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Segment
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          Duplicate Segment
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: googleColors.red }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Segment
        </MenuItem>
      </Menu>

      {/* New Segment Dialog */}
      <Dialog open={newSegmentDialog} onClose={() => setNewSegmentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Create New Customer Segment
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Segment Name"
              placeholder="e.g., Premium Customers, Inactive Users"
              fullWidth
              size="small"
            />
            
            <TextField
              label="Description"
              placeholder="Describe this segment..."
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              Dynamic segments automatically update based on customer behavior and attributes.
              Static segments require manual customer management.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setNewSegmentDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setNewSegmentDialog(false)}
            sx={{
              background: primaryColor,
              color: 'white',
              '&:hover': {
                background: '#3367D6',
              }
            }}
          >
            Create Segment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AudiencesTab;