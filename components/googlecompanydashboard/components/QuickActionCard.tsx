// components/googlecompanydashboard/components/QuickActionCard.tsx
import React from 'react';
import { PlusCircle, BarChart3, Settings, CreditCard } from 'lucide-react';
import { GOOGLE_COLORS } from '../constants';

interface QuickActionCardProps {
  label: string;
  description: string;
  icon: 'plus' | 'chart' | 'settings' | 'card';
  color: string;
  onClick: () => void;
  darkMode: boolean;
}

const getIcon = (icon: string, color: string, size: number = 20) => {
  switch (icon) {
    case 'plus':
      return <PlusCircle style={{ width: size, height: size, color }} />;
    case 'chart':
      return <BarChart3 style={{ width: size, height: size, color }} />;
    case 'settings':
      return <Settings style={{ width: size, height: size, color }} />;
    case 'card':
      return <CreditCard style={{ width: size, height: size, color }} />;
    default:
      return null;
  }
};

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  label,
  description,
  icon,
  color,
  onClick,
  darkMode
}) => {
  const styles = {
    card: {
      flex: '1 1 200px',
      padding: '20px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '12px',
      background: darkMode ? '#303134' : '#ffffff',
      textAlign: 'left' as const,
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  return (
    <button
      onClick={onClick}
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = darkMode ? '#3c4043' : GOOGLE_COLORS.lightGrey;
        e.currentTarget.style.borderColor = darkMode ? '#5f6368' : '#dadce0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = darkMode ? '#303134' : '#ffffff';
        e.currentTarget.style.borderColor = darkMode ? '#3c4043' : '#dadce0';
      }}
    >
      <div style={{ 
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: darkMode ? `${color}20` : `${color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px'
      }}>
        {getIcon(icon, color)}
      </div>
      <p style={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', margin: 0, fontSize: '15px' }}>
        {label}
      </p>
      <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, marginTop: '6px' }}>
        {description}
      </p>
    </button>
  );
};