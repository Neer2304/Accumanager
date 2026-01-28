// app/community/profile/page.tsx
import React from 'react';
import { Metadata } from 'next';
import CommunityProfilePage from '@/components/community/CommunityProfilePage';

export const metadata: Metadata = {
  title: 'Community Profile - Connect with Users',
  description: 'View and manage community profiles, follow users, and engage with the community',
};

export default function CommunityProfileRoute() {
  return <CommunityProfilePage />;
}