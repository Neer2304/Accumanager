"use client";
// use this in main page 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamMemberCard, TeamMember } from '@/components/team/TeamMemberCard';
import { ActivitiesPanel, TeamActivity } from '@/components/team/ActivitiesPanel';
import { TeamStatsCards } from '@/components/team/TeamStatsCards';

export default function TeamActivityPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recentActivities, setRecentActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      setError(null);
      const response = await fetch('/api/users/team');
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      setTeamMembers(data.teamMembers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data');
    }
  };

  const fetchTeamActivities = async () => {
    try {
      const response = await fetch('/api/activities/team');
      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchTeamActivities();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTeamActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshData = () => {
    setLoading(true);
    fetchTeamMembers();
    fetchTeamActivities();
  };

  if (loading) {
    return (
      <MainLayout title="Team Activity">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Activity">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <TeamHeader
          memberCount={teamMembers.length}
          onAddProject={() => window.open('/projects', '_self')}
          onRefresh={refreshData}
          autoRefresh={autoRefresh}
          onAutoRefreshChange={setAutoRefresh}
          loading={loading}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Team Stats */}
        <TeamStatsCards
          members={teamMembers}
          totalActivities={recentActivities.length}
          activeProjects={Array.from(new Set(teamMembers.flatMap(m => m.currentProjects))).length}
          completionRate={Math.floor((teamMembers.filter(m => m.status === 'active').length / teamMembers.length) * 100)}
        />

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3 
        }}>
          {/* Team Members */}
          <Box sx={{ flex: 1 }}>
            <TeamMemberCard
              members={teamMembers}
              autoRefresh={autoRefresh}
              onAutoRefreshChange={setAutoRefresh}
            />
          </Box>

          {/* Recent Activities */}
          <Box sx={{ flex: 1 }}>
            <ActivitiesPanel
              activities={recentActivities}
              onRefresh={refreshData}
              loading={loading}
              showAddButton={true}
              onAddClick={() => window.open('/activities/create', '_self')}
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}