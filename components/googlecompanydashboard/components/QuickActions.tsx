// components/googlecompanydashboard/components/QuickActions.tsx
import React from 'react';
import { QuickActionCard } from './QuickActionCard';
import { quickActions, GOOGLE_COLORS } from '../constants';

interface QuickActionsProps {
  companyId: string;
  onNavigate: (path: string) => void;
  darkMode: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  companyId,
  onNavigate,
  darkMode
}) => {
  const styles = {
    container: {
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      borderRadius: '16px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      padding: '28px',
      transition: 'background-color 0.2s, border-color 0.2s',
      boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
    },
    title: {
      fontSize: '20px', 
      fontWeight: 500, 
      color: darkMode ? '#e8eaed' : '#202124',
      margin: '0 0 20px 0',
      letterSpacing: '-0.5px'
    },
    grid: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Quick Actions
      </h2>
      <div style={styles.grid}>
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.id}
            label={action.label}
            description={action.description}
            icon={action.icon as any}
            color={action.color}
            onClick={() => {
              if (action.id === 'invite') {
                onNavigate(`/companies/${companyId}/${action.path}`);
              } else if (action.id === 'settings') {
                onNavigate(`/companies/${companyId}/${action.path}`);
              } else {
                onNavigate(action.path);
              }
            }}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};