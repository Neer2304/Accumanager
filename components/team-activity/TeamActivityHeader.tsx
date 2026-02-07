// components/team-activity/TeamActivityHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  Add,
  Refresh,
} from '@mui/icons-material';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TeamStats } from './types';

interface TeamActivityHeaderProps {
  title: string;
  description: string;
  stats: TeamStats;
  onRefresh: () => void;
  onAddMember: () => void;
}

const TeamActivityHeader: React.FC<TeamActivityHeaderProps> = ({
  title,
  description,
  stats,
  onRefresh,
  onAddMember,
}) => {
  return (
    <>
      <Breadcrumbs sx={{ 
        mb: { xs: 1, sm: 2 }, 
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' } 
      }}>
        <MuiLink 
          component={Link} 
          href="/dashboard" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: '#9aa0a6', 
            fontWeight: 300, 
            "&:hover": { color: '#8ab4f8' } 
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: { xs: '14px', sm: '16px', md: '18px' } }} />
          Dashboard
        </MuiLink>
        <Typography color="#e8eaed" fontWeight={400}>
          Team Activity
        </Typography>
      </Breadcrumbs>

      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}>
        <Typography 
          variant="h3" 
          fontWeight={500} 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#e8eaed',
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#9aa0a6', 
            fontWeight: 300,
            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.5,
            maxWidth: 600,
            mx: 'auto',
            mb: 3,
          }}
        >
          {description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          flexWrap: 'wrap',
        }}>
          <Chip
            label={`${stats.totalTeamMembers} Team Members`}
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          />
          <Chip
            label={`${stats.activeMembers} Active Now`}
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          />
          <Chip
            label={`${stats.totalProjects} Active Projects`}
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
            }}
          />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          mt: 3,
        }}>
          <Button
            variant="outlined"
            onClick={onRefresh}
            iconLeft={<Refresh />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            onClick={onAddMember}
            iconLeft={<Add />}
            sx={{
              backgroundColor: '#34a853',
              '&:hover': { backgroundColor: '#2d9248' }
            }}
          >
            Add Team Member
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TeamActivityHeader;