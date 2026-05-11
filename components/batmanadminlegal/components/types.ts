// components/batmanadminlegal/components/types.ts
export interface LegalDocument { _id: string; type: string; title: string; content: string; version: string; lastUpdated: string; lastUpdatedBy: { _id: string; name: string; email: string; }; isActive: boolean; createdAt?: string; }
export interface DocumentTypeConfig { type: string; label: string; description: string; apiEndpoint: string; }
export interface SnackbarState { open: boolean; message: string; severity: 'success' | 'error'; }

export const batmanColors = {
  primary: '#ffd700', gold: '#ffd700', goldHov: '#e6c200', goldSoft: 'rgba(255,215,0,0.12)', goldGlow: 'rgba(255,215,0,0.25)',
  bg: '#0a0a0a', surface: '#0f0f0f', surface2: '#141414', border: '#1f1f1f', borderHot: '#ffd700',
  ink: '#e8e8e8', inkSub: '#888888', inkMuted: '#444444', success: '#00ff88', error: '#ff4444',
};