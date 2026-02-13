'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Avatar,
  Chip,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Paper
} from "@mui/material";
import {
  User,
  Shield,
  MoreVertical,
  Trash2,
  UserCog,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { companyService } from '@/services/companyService';
import MemberRoleBadge from './MemberRoleBadge';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4',
  purple: '#7c4dff'
};

interface MemberListProps {
  members: any[];
  companyId: string;
  isAdmin: boolean;
  onUpdate: () => void;
  darkMode?: boolean;
}

export default function MemberList({ 
  members, 
  companyId, 
  isAdmin, 
  onUpdate,
  darkMode = false 
}: MemberListProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      setUpdating(memberId);
      await companyService.updateMemberRole(companyId, memberId, role);
      onUpdate();
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    try {
      setUpdating(memberId);
      await companyService.removeMember(companyId, memberId);
      onUpdate();
      setAnchorEl(null);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to remove member:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
      case 'accepted':
        return <CheckCircle size={14} color={GOOGLE_COLORS.green} />;
      case 'pending':
        return <Clock size={14} color={GOOGLE_COLORS.yellow} />;
      case 'declined':
        return <XCircle size={14} color={GOOGLE_COLORS.red} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
      case 'accepted':
        return GOOGLE_COLORS.green;
      case 'pending':
        return GOOGLE_COLORS.yellow;
      case 'declined':
        return GOOGLE_COLORS.red;
      default:
        return GOOGLE_COLORS.grey;
    }
  };

  const activeMembers = members.filter((m: any) => m.status === 'active' || m.status === 'accepted');

  if (activeMembers.length === 0) {
    return (
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        bgcolor: darkMode ? '#2d2e30' : '#fff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        borderRadius: '12px'
      }}>
        <Box sx={{ mb: 3 }}>
          <Avatar sx={{
            width: 80,
            height: 80,
            bgcolor: darkMode ? alpha(GOOGLE_COLORS.blue, 0.1) : alpha(GOOGLE_COLORS.blue, 0.05),
            color: GOOGLE_COLORS.blue,
            margin: '0 auto',
            borderRadius: '16px'
          }}>
            <User size={40} />
          </Avatar>
        </Box>
        <Typography variant="h6" sx={{
          mb: 1,
          fontWeight: 500,
          color: darkMode ? '#e8eaed' : '#202124'
        }}>
          No members yet
        </Typography>
        <Typography sx={{
          color: darkMode ? '#9aa0a6' : '#5f6368',
          fontSize: '0.875rem'
        }}>
          {isAdmin 
            ? "Add your first team member to collaborate on this company"
            : "No team members have been added yet"}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      bgcolor: darkMode ? '#2d2e30' : '#fff',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Header - Desktop */}
      <Box sx={{
        display: { xs: 'none', md: 'grid' },
        gridTemplateColumns: 'minmax(300px, 2fr) 160px 140px 140px 80px',
        gap: 2,
        p: 2,
        bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        color: darkMode ? '#9aa0a6' : '#5f6368',
        fontSize: '0.75rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <Typography>Member</Typography>
        <Typography>Role</Typography>
        <Typography>Status</Typography>
        <Typography>Joined</Typography>
        <Typography align="right">Actions</Typography>
      </Box>

      {/* Members List */}
      <Box sx={{ divideY: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
        {activeMembers.map((member: any) => (
          <Box
            key={member._id || member.memberId}
            sx={{
              display: { xs: 'block', md: 'grid' },
              gridTemplateColumns: { md: 'minmax(300px, 2fr) 160px 140px 140px 80px' },
              gap: { md: 2 },
              p: 2,
              alignItems: 'center',
              '&:hover': {
                bgcolor: darkMode ? alpha('#fff', 0.02) : alpha('#000', 0.01)
              }
            }}
          >
            {/* Member Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 1, md: 0 } }}>
              <Avatar sx={{
                bgcolor: member.user?.avatar ? 'transparent' : alpha(GOOGLE_COLORS.blue, 0.1),
                color: GOOGLE_COLORS.blue,
                width: 40,
                height: 40,
                borderRadius: '12px'
              }}>
                {member.user?.avatar ? (
                  <img src={member.user.avatar} alt={member.memberName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (member.memberName || member.memberEmail || 'U').charAt(0).toUpperCase()
                )}
              </Avatar>
              <Box>
                <Typography sx={{
                  fontWeight: 500,
                  color: darkMode ? '#e8eaed' : '#202124',
                  fontSize: '0.9375rem'
                }}>
                  {member.memberName || member.user?.name || 'Pending User'}
                </Typography>
                <Typography sx={{
                  fontSize: '0.8125rem',
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25
                }}>
                  {member.memberEmail || member.user?.email}
                </Typography>
              </Box>
            </Box>

            {/* Role - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {isAdmin && member.role !== 'admin' ? (
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={member.role}
                    onChange={(e: SelectChangeEvent) => handleRoleChange(member.memberId, e.target.value)}
                    disabled={updating === member.memberId}
                    sx={{
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontSize: '0.875rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#3c4043' : '#dadce0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: darkMode ? '#9aa0a6' : '#202124'
                      },
                      '& .MuiSvgIcon-root': {
                        color: darkMode ? '#9aa0a6' : '#5f6368'
                      },
                      '&.Mui-disabled': {
                        color: darkMode ? '#9aa0a6' : '#5f6368'
                      }
                    }}
                  >
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <MemberRoleBadge role={member.role} darkMode={darkMode} />
              )}
            </Box>

            {/* Status - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Chip
                // icon={getStatusIcon(member.status)}
                label={member.status}
                size="small"
                sx={{
                  bgcolor: alpha(getStatusColor(member.status), 0.1),
                  color: getStatusColor(member.status),
                  border: 'none',
                  textTransform: 'capitalize',
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-icon': { color: 'inherit', marginLeft: '4px' }
                }}
              />
            </Box>

            {/* Joined Date - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{
                fontSize: '0.875rem',
                color: darkMode ? '#9aa0a6' : '#5f6368'
              }}>
                {new Date(member.joinedAt || member.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>

            {/* Actions - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              {isAdmin && member.role !== 'admin' && (
                <IconButton
                  size="small"
                  onClick={() => handleRemove(member.memberId, member.memberName)}
                  disabled={updating === member.memberId}
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                    '&:hover': {
                      color: GOOGLE_COLORS.red,
                      bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05)
                    },
                    '&.Mui-disabled': {
                      color: darkMode ? '#3c4043' : '#dadce0'
                    }
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              )}
              {member.role === 'admin' && (
                <Chip
                  icon={<Shield size={14} />}
                  label="Owner"
                  size="small"
                  sx={{
                    bgcolor: alpha(GOOGLE_COLORS.purple, 0.1),
                    color: GOOGLE_COLORS.purple,
                    border: `1px solid ${alpha(GOOGLE_COLORS.purple, 0.2)}`,
                    fontSize: '0.75rem',
                    height: '24px',
                    '& .MuiChip-icon': { color: GOOGLE_COLORS.purple }
                  }}
                />
              )}
            </Box>

            {/* Mobile View */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
                {/* Role Badge - Mobile */}
                {isAdmin && member.role !== 'admin' ? (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={member.role}
                      onChange={(e: SelectChangeEvent) => handleRoleChange(member.memberId, e.target.value)}
                      disabled={updating === member.memberId}
                      sx={{
                        color: darkMode ? '#e8eaed' : '#202124',
                        fontSize: '0.8125rem',
                        height: '32px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: darkMode ? '#3c4043' : '#dadce0'
                        }
                      }}
                    >
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="member">Member</MenuItem>
                      <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <MemberRoleBadge role={member.role} darkMode={darkMode} />
                )}

                {/* Status Chip - Mobile */}
                <Chip
                  // icon={getStatusIcon(member.status)}
                  label={member.status}
                  size="small"
                  sx={{
                    bgcolor: alpha(getStatusColor(member.status), 0.1),
                    color: getStatusColor(member.status),
                    border: 'none',
                    textTransform: 'capitalize',
                    fontSize: '0.75rem',
                    height: '24px'
                  }}
                />

                {/* Owner Badge - Mobile */}
                {member.role === 'admin' && (
                  <Chip
                    icon={<Shield size={14} />}
                    label="Owner"
                    size="small"
                    sx={{
                      bgcolor: alpha(GOOGLE_COLORS.purple, 0.1),
                      color: GOOGLE_COLORS.purple,
                      border: `1px solid ${alpha(GOOGLE_COLORS.purple, 0.2)}`,
                      fontSize: '0.75rem',
                      height: '24px'
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{
                  fontSize: '0.75rem',
                  color: darkMode ? '#9aa0a6' : '#5f6368'
                }}>
                  Joined {new Date(member.joinedAt || member.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>

                {/* Remove Button - Mobile */}
                {isAdmin && member.role !== 'admin' && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(member.memberId, member.memberName)}
                    disabled={updating === member.memberId}
                    sx={{
                      color: darkMode ? '#9aa0a6' : '#5f6368',
                      '&:hover': {
                        color: GOOGLE_COLORS.red,
                        bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05)
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}