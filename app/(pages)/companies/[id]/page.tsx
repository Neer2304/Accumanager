'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@mui/material';
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import { 
  Building2, 
  Users, 
  Settings, 
  ArrowLeft, 
  Edit, 
  BarChart3,
  PlusCircle,
  CreditCard
} from 'lucide-react';

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

export default function CompanyDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const companyId = params.id as string;
  
  const { companies, setCurrentCompany } = useCompany();
  const company = companies.find((c: any) => c._id === companyId);
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    members: 0
  });

  useEffect(() => {
    if (company) {
      setCurrentCompany(company);
      fetchStats();
    }
  }, [company]);

  const fetchStats = async () => {
    try {
      const res = await companyService.getCompanyStats(companyId);
      if (res.success) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (!company) {
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
  }

  const isAdmin = company.userRole === 'admin';

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
      padding: '32px 0',
      transition: 'background-color 0.2s'
    },
    wrapper: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 24px'
    },
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
    statCard: {
      flex: '1 1 300px',
      backgroundColor: darkMode ? '#303134' : '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      transition: 'all 0.2s',
      boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
    },
    quickActionCard: {
      flex: '1 1 200px',
      padding: '20px',
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '12px',
      background: darkMode ? '#303134' : '#ffffff',
      textAlign: 'left' as const,
      cursor: 'pointer',
      transition: 'all 0.2s'
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
    statValue: {
      fontSize: '36px',
      fontWeight: 500,
      color: darkMode ? '#e8eaed' : '#202124',
      marginTop: '8px',
      marginBottom: '4px',
      lineHeight: 1.2
    },
    statLabel: {
      fontSize: '14px',
      color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey,
      margin: 0,
      fontWeight: 500
    },
    iconContainer: {
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/companies')}
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
                onClick={() => router.push(`/companies/${companyId}/settings`)}
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

        {/* Stats Cards - Using flex instead of grid */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Team Members Card */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={styles.statLabel}>Team Members</p>
                <p style={styles.statValue}>
                  {company.memberCount || 1}
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, margin: 0 }}>
                  Max: {company.maxMembers || 10} members
                </p>
              </div>
              <div style={{ 
                ...styles.iconContainer,
                backgroundColor: darkMode ? `${GOOGLE_COLORS.blue}20` : `${GOOGLE_COLORS.blue}10`
              }}>
                <Users style={{ width: '26px', height: '26px', color: GOOGLE_COLORS.blue }} />
              </div>
            </div>
            <button
              onClick={() => router.push(`/companies/${companyId}/members`)}
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
              Manage Team
            </button>
          </div>

          {/* Projects Card */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={styles.statLabel}>Active Projects</p>
                <p style={styles.statValue}>
                  {stats.projects}
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, margin: 0 }}>
                  Ongoing projects
                </p>
              </div>
              <div style={{ 
                ...styles.iconContainer,
                backgroundColor: darkMode ? `${GOOGLE_COLORS.green}20` : `${GOOGLE_COLORS.green}10`
              }}>
                <BarChart3 style={{ width: '26px', height: '26px', color: GOOGLE_COLORS.green }} />
              </div>
            </div>
            <button
              onClick={() => router.push(`/projects?company=${companyId}`)}
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
              View Projects
            </button>
          </div>

          {/* Tasks Card */}
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={styles.statLabel}>Tasks</p>
                <p style={styles.statValue}>
                  {stats.tasks}
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, margin: 0 }}>
                  Pending tasks
                </p>
              </div>
              <div style={{ 
                ...styles.iconContainer,
                backgroundColor: darkMode ? `${GOOGLE_COLORS.yellow}20` : `${GOOGLE_COLORS.yellow}10`
              }}>
                <Edit style={{ width: '26px', height: '26px', color: GOOGLE_COLORS.yellow }} />
              </div>
            </div>
            <button
              onClick={() => router.push(`/tasks?company=${companyId}`)}
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
              View Tasks
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        {isAdmin && (
          <div style={{ 
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            padding: '28px',
            transition: 'background-color 0.2s, border-color 0.2s',
            boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 500, 
              color: darkMode ? '#e8eaed' : '#202124',
              margin: '0 0 20px 0',
              letterSpacing: '-0.5px'
            }}>
              Quick Actions
            </h2>
            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <button
                onClick={() => router.push(`/companies/${companyId}/members/invite`)}
                style={styles.quickActionCard}
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
                  backgroundColor: darkMode ? `${GOOGLE_COLORS.blue}20` : `${GOOGLE_COLORS.blue}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <PlusCircle style={{ width: '20px', height: '20px', color: GOOGLE_COLORS.blue }} />
                </div>
                <p style={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', margin: 0, fontSize: '15px' }}>
                  Add Team Member
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, marginTop: '6px' }}>
                  Invite new members to your team
                </p>
              </button>

              <button
                onClick={() => router.push('/projects/create')}
                style={styles.quickActionCard}
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
                  backgroundColor: darkMode ? `${GOOGLE_COLORS.green}20` : `${GOOGLE_COLORS.green}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <BarChart3 style={{ width: '20px', height: '20px', color: GOOGLE_COLORS.green }} />
                </div>
                <p style={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', margin: 0, fontSize: '15px' }}>
                  Create Project
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, marginTop: '6px' }}>
                  Start a new project
                </p>
              </button>

              <button
                onClick={() => router.push(`/companies/${companyId}/settings`)}
                style={styles.quickActionCard}
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
                  backgroundColor: darkMode ? `${GOOGLE_COLORS.grey}20` : `${GOOGLE_COLORS.grey}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Settings style={{ width: '20px', height: '20px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey }} />
                </div>
                <p style={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', margin: 0, fontSize: '15px' }}>
                  Company Settings
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, marginTop: '6px' }}>
                  Update company information
                </p>
              </button>

              <button
                onClick={() => router.push('/billing')}
                style={styles.quickActionCard}
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
                  backgroundColor: darkMode ? `${GOOGLE_COLORS.purple}20` : `${GOOGLE_COLORS.purple}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <CreditCard style={{ width: '20px', height: '20px', color: GOOGLE_COLORS.purple }} />
                </div>
                <p style={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#202124', margin: 0, fontSize: '15px' }}>
                  Upgrade Plan
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#9aa0a6' : GOOGLE_COLORS.grey, marginTop: '6px' }}>
                  Get more features and limits
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}