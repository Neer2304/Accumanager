// components/ScreenTimeTracker.tsx
'use client';

import { useEffect } from 'react';
import { useScreenTimeTracker } from '@/hooks/useScreenTimeTracker';

export default function ScreenTimeTracker() {
  useScreenTimeTracker();
  
  // This component doesn't render anything
  return null;
}