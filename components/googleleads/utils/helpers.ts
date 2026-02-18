import { Lead, LeadStatus, LeadSource, InterestLevel } from '../types';
import { LEAD_STATUS, LEAD_SOURCES, INTEREST_LEVELS } from '../constants';

export function getStatusColor(status: string): string {
  const statusConfig = LEAD_STATUS.find(s => s.value === status);
  return statusConfig?.color || '#80868b';
}

export function getStatusEmoji(status: string): string {
  const statusConfig = LEAD_STATUS.find(s => s.value === status);
  return statusConfig?.emoji || '📌';
}

export function getSourceEmoji(source: string): string {
  const sourceConfig = LEAD_SOURCES.find(s => s.value === source);
  return sourceConfig?.emoji || '📌';
}

export function getInterestColor(level: string): string {
  const config = INTEREST_LEVELS.find(l => l.value === level);
  return config?.color || '#80868b';
}

export function getInterestEmoji(level: string): string {
  const config = INTEREST_LEVELS.find(l => l.value === level);
  return config?.emoji || '😐';
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function sortLeads(leads: Lead[], orderBy: keyof Lead, order: 'asc' | 'desc'): Lead[] {
  return [...leads].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    
    if (orderBy === 'createdAt' || orderBy === 'lastContactedAt' || orderBy === 'nextFollowUp') {
      return order === 'asc' 
        ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
        : new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
    }
    
    if (orderBy === 'budget' || orderBy === 'score') {
      return order === 'asc' 
        ? (aVal as number || 0) - (bVal as number || 0)
        : (bVal as number || 0) - (aVal as number || 0);
    }
    
    if (orderBy === 'fullName') {
      const aName = a.fullName || `${a.firstName} ${a.lastName}`;
      const bName = b.fullName || `${b.firstName} ${b.lastName}`;
      return order === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    
    return order === 'asc'
      ? String(aVal || '').localeCompare(String(bVal || ''))
      : String(bVal || '').localeCompare(String(aVal || ''));
  });
}

export function calculateStats(leads: Lead[]) {
  return [
    { label: 'Total Leads', value: leads.length, color: '#1a73e8', icon: 'PersonIcon' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: '#1e8e3e', icon: 'CheckCircleIcon' },
    { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: '#f9ab00', icon: 'PhoneIcon' },
    { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#7c4dff', icon: 'TrendingUpIcon' },
    { label: 'Conversion Rate', value: leads.length > 0 ? `${Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100)}%` : '0%', color: '#d93025', icon: 'AnalyticsIcon' }
  ];
}