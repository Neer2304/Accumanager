// components/googlecompanydashboard/components/StatCard.tsx
import React from 'react';
import { useTheme } from '@mui/material';
import { Users, BarChart3, Edit } from 'lucide-react';
import { GOOGLE_COLORS } from '../constants';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: 'users' | 'chart' | 'edit';
  color: string;
  buttonText: string;
  onButtonClick: () => void;
  darkMode: boolean;
}

const getIcon = (icon: string, color: string, size: number = 26) => {
  switch (icon) {
    case 'users':
      return <Users style={{ width: size, height: size, color }} />;
    case 'chart':
      return <BarChart3 style={{ width: size, height: size, color }} />;
    case 'edit':
      return <Edit style={{ width: size, height: size, color }} />;
    default:
      return null;
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  buttonText,
  onButtonClick,
  darkMode
}) => {
  const styles = {
    card: {
      flex: '1 1 300px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      transition: 'all 0.2s',
      boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
    },
    iconContainer: {
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: darkMode ? `${color}20` : `${color}10`
    }
  };

  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, margin: 0, fontWeight: 500 }}>
            {title}
          </p>
          <p style={{ 
            fontSize: '36px', 
            fontWeight: 500, 
            color: darkMode ? '#e8eaed' : '#202124',
            marginTop: '8px',
            marginBottom: '4px',
            lineHeight: 1.2
          }}>
            {value}
          </p>
          <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, margin: 0 }}>
            {subtitle}
          </p>
        </div>
        <div style={styles.iconContainer}>
          {getIcon(icon, color)}
        </div>
      </div>
      <button
        onClick={onButtonClick}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '10px 16px',
          backgroundColor: darkMode ? '#3c4043' : GOOGLE_COLORS.lightGrey,
          color: darkMode ? '#e8eaed' : GOOGLE_COLORS.darkGrey,
          border: 'none',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#4a4e54' : '#e4e5e7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#3c4043' : GOOGLE_COLORS.lightGrey;
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};