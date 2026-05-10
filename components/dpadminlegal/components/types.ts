// components/dpadminlegal/components/types.ts
export interface LegalDocument { _id: string; type: string; title: string; content: string; version: string; lastUpdated: string; lastUpdatedBy: { _id: string; name: string; email: string; }; isActive: boolean; createdAt?: string; }
export interface DocumentTypeConfig { type: string; label: string; description: string; apiEndpoint: string; }
export interface SnackbarState { open: boolean; message: string; severity: 'success' | 'error'; }

export const dpColors = {
  primary: '#dc2626', red: '#dc2626', redHov: '#b91c1c', redSoft: 'rgba(220,38,38,0.12)', redGlow: 'rgba(220,38,38,0.25)',
  bg: '#0d0000', surface: '#1a0505', surface2: '#260a0a', border: '#4a1010', borderHot: '#dc2626',
  ink: '#f5e0e0', inkSub: '#b08080', inkMuted: '#7a4040', success: '#4ade80', error: '#f87171', gold: '#fbbf24',
};