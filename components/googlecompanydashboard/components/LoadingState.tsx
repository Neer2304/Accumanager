// components/googlecompanydashboard/components/LoadingState.tsx
import React from 'react';
import { useTheme } from '@mui/material';
import { GOOGLE_COLORS } from '../constants';

interface LoadingStateProps {
  darkMode: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ darkMode }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: `3px solid ${darkMode ? '#3c4043' : '#e8eaed'}`,
          borderTopColor: GOOGLE_COLORS.blue,
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ 
          marginTop: '16px', 
          color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
          fontSize: '14px',
          fontWeight: 500
        }}>
          Loading company...
        </p>
      </div>
    </div>
  );
};