// components/googlecompanydashboard/components/DashboardHeader.tsx
import React from 'react';
import { useTheme } from '@mui/material';
import { ArrowLeft, Building2, Settings } from 'lucide-react';
import { GOOGLE_COLORS } from '../constants';

interface Company {
  _id: string;
  name: string;
  email: string;
  industry?: string;
  size: string;
  userRole: string;
  plan?: string;
}

interface DashboardHeaderProps {
  company: Company;
  isAdmin: boolean;
  onBack: () => void;
  onSettings: () => void;
  darkMode: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  company,
  isAdmin,
  onBack,
  onSettings,
  darkMode
}) => {
  const styles = {
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
      background: 'none',
      border: 'none',
      padding: '8px 0',
      marginBottom: '24px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'color 0.2s'
    },
    headerCard: {
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      borderRadius: '16px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      padding: '28px',
      marginBottom: '24px',
      boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'background-color 0.2s, border-color 0.2s'
    },
    roleChip: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 500,
      borderRadius: '16px',
      backgroundColor: company.userRole === 'admin' 
        ? darkMode ? '#7c4dff20' : `${GOOGLE_COLORS.purple}10`
        : darkMode ? '#5f636820' : `${GOOGLE_COLORS.grey}10`,
      color: company.userRole === 'admin' 
        ? GOOGLE_COLORS.purple
        : darkMode ? '#e8eaed' : GOOGLE_COLORS.grey,
      border: `1px solid ${company.userRole === 'admin' 
        ? darkMode ? '#7c4dff40' : `${GOOGLE_COLORS.purple}20`
        : darkMode ? '#5f636840' : `${GOOGLE_COLORS.grey}20`}`,
      textTransform: 'capitalize' as const
    },
    settingsButton: {
      padding: '10px',
      color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
      background: 'none',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={styles.backButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = darkMode ? '#e8eaed' : GOOGLE_COLORS.darkGrey;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey;
        }}
      >
        <ArrowLeft style={{ width: '18px', height: '18px', marginRight: '8px' }} />
        Back to Companies
      </button>

      {/* Company Header */}
      <div style={styles.headerCard}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(26,115,232,0.2)'
            }}>
              <Building2 style={{ width: '36px', height: '36px', color: '#fff' }} />
            </div>
            <div style={{ marginLeft: '20px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 500, 
                color: darkMode ? '#e8eaed' : '#202124',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                {company.name}
              </h1>
              <p style={{ 
                color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, 
                marginTop: '6px',
                fontSize: '15px'
              }}>
                {company.industry || 'General Business'} • {company.size} employees
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginTop: '12px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span style={styles.roleChip}>
                  {company.userRole}
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ 
                    width: '4px', 
                    height: '4px', 
                    borderRadius: '50%', 
                    backgroundColor: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
                    display: 'inline-block',
                    marginRight: '8px'
                  }} />
                  {company.email}
                </span>
                {company.plan && (
                  <span style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '16px',
                    backgroundColor: darkMode ? '#1e8e3e20' : `${GOOGLE_COLORS.green}10`,
                    color: GOOGLE_COLORS.green,
                    border: `1px solid ${darkMode ? '#1e8e3e40' : `${GOOGLE_COLORS.green}20`}`,
                    textTransform: 'uppercase'
                  }}>
                    {company.plan}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={onSettings}
              style={styles.settingsButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#3c4043' : GOOGLE_COLORS.lightGrey;
                e.currentTarget.style.color = darkMode ? '#e8eaed' : GOOGLE_COLORS.darkGrey;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey;
              }}
            >
              <Settings style={{ width: '22px', height: '22px' }} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};