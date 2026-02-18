import React from 'react';
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
  TablePagination,
  TableSortLabel,
  Avatar,
  Chip as MuiChip,
  IconButton,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { Lead } from '../types';
import { LEAD_STATUS, LEAD_SOURCES, GOOGLE_COLORS } from '../constants';
import { getStatusColor, getStatusEmoji, getSourceEmoji, formatCurrency, formatDate } from '../utils/helpers';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  paginatedLeads: Lead[];
  orderBy: keyof Lead;
  order: 'asc' | 'desc';
  onSort: (property: keyof Lead) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLeadClick: (lead: Lead) => void;
  onViewClick: (lead: Lead, event: React.MouseEvent) => void;
  onMenuClick: (lead: Lead, event: React.MouseEvent) => void;
  darkMode: boolean;
  getCompanyName: (companyId: string) => string;
}

export function LeadTable({
  leads,
  loading,
  paginatedLeads,
  orderBy,
  order,
  onSort,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onLeadClick,
  onViewClick,
  onMenuClick,
  darkMode,
  getCompanyName
}: LeadTableProps) {
  if (loading) {
    return (
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px'
      }}>
        <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
        <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Loading leads...
        </Typography>
      </Paper>
    );
  }

  if (leads.length === 0) {
    return (
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '16px'
      }}>
        <PersonIcon sx={{ fontSize: 60, color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          No Leads Found
        </Typography>
        <Typography sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
          Start building your pipeline by adding your first lead.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      overflow: 'hidden',
      bgcolor: darkMode ? '#2d2e30' : '#fff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '16px'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fullName'}
                  direction={orderBy === 'fullName' ? order : 'asc'}
                  onClick={() => onSort('fullName')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Lead
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'source'}
                  direction={orderBy === 'source' ? order : 'asc'}
                  onClick={() => onSort('source')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Source
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => onSort('status')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'budget'}
                  direction={orderBy === 'budget' ? order : 'asc'}
                  onClick={() => onSort('budget')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Budget
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'score'}
                  direction={orderBy === 'score' ? order : 'asc'}
                  onClick={() => onSort('score')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Score
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => onSort('createdAt')}
                  sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
                >
                  Created
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow
                key={lead._id}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: darkMode ? '#303134' : '#f8f9fa' },
                  borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}
                onClick={() => onLeadClick(lead)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getStatusColor(lead.status), 0.1),
                        color: getStatusColor(lead.status),
                        width: 32,
                        height: 32
                      }}
                    >
                      {getStatusEmoji(lead.status)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {lead.fullName || `${lead.firstName} ${lead.lastName}`}
                      </Typography>
                      {lead.position && (
                        <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                          {lead.position}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {lead.email && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        {lead.email}
                      </Typography>
                    )}
                    {lead.phone && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                        {lead.phone}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <MuiChip
                    label={`${getSourceEmoji(lead.source)} ${lead.source.replace('_', ' ')}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <MuiChip
                    label={LEAD_STATUS.find(s => s.value === lead.status)?.label || lead.status}
                    size="small"
                    sx={{
                      bgcolor: alpha(getStatusColor(lead.status), 0.1),
                      color: getStatusColor(lead.status),
                      borderColor: alpha(getStatusColor(lead.status), 0.3),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {lead.assignedToName ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Avatar sx={{ width: 20, height: 20, bgcolor: alpha(GOOGLE_COLORS.blue, 0.1) }}>
                        <PersonIcon sx={{ fontSize: 12, color: GOOGLE_COLORS.blue }} />
                      </Avatar>
                      <Typography variant="caption" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        {lead.assignedToName}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Unassigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {lead.budget ? (
                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {formatCurrency(lead.budget, lead.currency)}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                      Not set
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: '#fbbc04' }} />
                    <Typography variant="body2" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                      {lead.score || 0}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                    {formatDate(lead.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => onViewClick(lead, e)}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => onMenuClick(lead, e)}
                      sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
          color: darkMode ? '#e8eaed' : '#202124',
        }}
      />
    </Paper>
  );
}