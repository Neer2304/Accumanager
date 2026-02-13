'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import MemberList from '@/components/companies/members/MemberList';
import AddMemberModal from '@/components/companies/members/AddMemberModal';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Breadcrumbs,
  IconButton,
  Avatar,
  Paper,
  Alert,
  Chip,
  Button
} from "@mui/material";
import {
  Users,
  ArrowLeft,
  UserPlus,
  Info,
  Home as HomeIcon,
} from 'lucide-react';
import Link from "next/link";
import { BusinessIcon } from '@/assets/icons/AboutIcons';
import { People, PeopleAlt } from '@mui/icons-material';

const GOOGLE_COLORS = {
  blue: '#1a73e8',
  red: '#d93025',
  green: '#1e8e3e',
  yellow: '#f9ab00',
  grey: '#5f6368',
  darkGrey: '#3c4043',
  lightGrey: '#f1f3f4'
};

export default function CompanyMembersPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const { companies } = useCompany();
  const company = companies.find((c: any) => c._id === companyId);
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [memberLimit, setMemberLimit] = useState({
    current: 0,
    max: 10,
    remaining: 10
  });

  const isAdmin = company?.userRole === 'admin';
  const canAddMembers = isAdmin;

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        setMembers(res.members || []);
        const activeCount = res.members.filter((m: any) => m.status === 'active').length;
        setMemberLimit({
          current: activeCount,
          max: company?.maxMembers || 10,
          remaining: (company?.maxMembers || 10) - activeCount
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch members:', error);
      setError(error.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (data: { email: string; name: string; role: string }) => {
    setAddingMember(true);
    try {
      const res = await companyService.addMember(companyId, data);
      if (!res.success) {
        throw new Error(res.error || 'Failed to add member');
      }
      await fetchMembers();
      setShowAddModal(false);
    } catch (error: any) {
      throw error;
    } finally {
      setAddingMember(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchMembers();
    }
  }, [companyId]);

  if (!company) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        bgcolor: darkMode ? '#202124' : '#f8f9fa'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
          <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            Loading company...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: darkMode ? '#202124' : '#f8f9fa',
      color: darkMode ? '#e8eaed' : '#202124',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <Box sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        background: darkMode
          ? 'linear-gradient(135deg, #0d3064 0%, #202124 100%)'
          : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
      }}>
        <Breadcrumbs sx={{
          mb: 2,
          color: darkMode ? '#9aa0a6' : '#5f6368',
          '& .MuiBreadcrumbs-separator': { color: darkMode ? '#5f6368' : '#dadce0' }
        }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <HomeIcon size={16} style={{ marginRight: 4 }} />
            Dashboard
          </Link>
          <Link href="/companies" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <BusinessIcon/>
            Companies
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: darkMode ? '#e8eaed' : '#202124' }}>
            {/* <People size={16} style={{ marginRight: 4 }} /> */}
            <PeopleAlt/>
            Members
          </Typography>
        </Breadcrumbs>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => router.back()}
              sx={{
                color: darkMode ? '#9aa0a6' : '#5f6368',
                '&:hover': { bgcolor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05) }
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 400,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                color: darkMode ? '#e8eaed' : '#202124',
                letterSpacing: '-0.5px'
              }}>
                Team Members
              </Typography>
              <Typography sx={{
                mt: 0.5,
                color: darkMode ? '#9aa0a6' : '#5f6368',
                fontSize: '0.875rem'
              }}>
                {company.name} • {memberLimit.current}/{memberLimit.max} members
              </Typography>
            </Box>
          </Box>

          {canAddMembers && memberLimit.remaining > 0 && (
            <Button
              onClick={() => setShowAddModal(true)}
              variant="contained"
              startIcon={<UserPlus size={18} />}
              sx={{
                bgcolor: GOOGLE_COLORS.blue,
                color: '#fff',
                px: 3,
                py: 1,
                borderRadius: '24px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#1557b0',
                },
              }}
            >
              Add Member
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{
        maxWidth: '1280px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4
      }}>
        {/* Member Limit Warning */}
        {memberLimit.remaining <= 0 && isAdmin && (
          <Alert
            severity="warning"
            icon={<Info size={20} />}
            sx={{
              mb: 4,
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.yellow, 0.1) : '#fef7e0',
              color: darkMode ? '#fdd663' : '#5f3b00',
              border: `1px solid ${darkMode ? alpha(GOOGLE_COLORS.yellow, 0.2) : alpha(GOOGLE_COLORS.yellow, 0.3)}`,
              '& .MuiAlert-icon': { color: darkMode ? '#fdd663' : GOOGLE_COLORS.yellow }
            }}
          >
            <Typography variant="body2">
              You've reached the maximum member limit ({memberLimit.max}) for the Free plan.
              Remove some members to add new ones or upgrade your plan.
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: '8px',
              bgcolor: darkMode ? alpha(GOOGLE_COLORS.red, 0.1) : alpha(GOOGLE_COLORS.red, 0.05),
              color: darkMode ? '#f28b82' : GOOGLE_COLORS.red,
              border: `1px solid ${darkMode ? alpha(GOOGLE_COLORS.red, 0.2) : alpha(GOOGLE_COLORS.red, 0.3)}`,
              '& .MuiAlert-icon': { color: GOOGLE_COLORS.red }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Member List */}
        {loading ? (
          <Paper sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: darkMode ? '#2d2e30' : '#fff',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            borderRadius: '12px'
          }}>
            <CircularProgress size={40} sx={{ color: GOOGLE_COLORS.blue }} />
            <Typography sx={{ mt: 2, color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Loading members...
            </Typography>
          </Paper>
        ) : (
          <MemberList
            members={members}
            companyId={companyId}
            isAdmin={isAdmin}
            onUpdate={fetchMembers}
            darkMode={darkMode}
          />
        )}

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMember}
          loading={addingMember}
          memberLimit={memberLimit}
          darkMode={darkMode}
        />
      </Box>
    </Box>
  );
}