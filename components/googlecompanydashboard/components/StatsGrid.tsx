// components/googlecompanydashboard/components/StatsGrid.tsx
import React from 'react';
import { StatCard } from './StatCard';
import { GOOGLE_COLORS } from '../constants';

interface Stats {
  projects: number;
  tasks: number;
  members: number;
}

interface StatsGridProps {
  stats: Stats;
  companyId: string;
  memberCount: number;
  maxMembers: number;
  onNavigate: (path: string) => void;
  darkMode: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  companyId,
  memberCount,
  maxMembers,
  onNavigate,
  darkMode
}) => {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {/* Team Members Card */}
      <StatCard
        title="Team Members"
        value={memberCount || 1}
        subtitle={`Max: ${maxMembers || 10} members`}
        icon="users"
        color={GOOGLE_COLORS.blue}
        buttonText="Manage Team"
        onButtonClick={() => onNavigate(`/companies/${companyId}/members`)}
        darkMode={darkMode}
      />

      {/* Projects Card */}
      <StatCard
        title="Active Projects"
        value={stats.projects}
        subtitle="Ongoing projects"
        icon="chart"
        color={GOOGLE_COLORS.green}
        buttonText="View Projects"
        onButtonClick={() => onNavigate(`/projects?company=${companyId}`)}
        darkMode={darkMode}
      />

      {/* Tasks Card */}
      <StatCard
        title="Tasks"
        value={stats.tasks}
        subtitle="Pending tasks"
        icon="edit"
        color={GOOGLE_COLORS.yellow}
        buttonText="View Tasks"
        onButtonClick={() => onNavigate(`/tasks?company=${companyId}`)}
        darkMode={darkMode}
      />
    </div>
  );
};