// components/dppos/components/DpBusinessDetails.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Alert, Avatar, Stack } from "@mui/material";
import { Store as StoreIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface Business {
  businessName: string; gstNumber: string; address: string; city: string; state: string; pincode: string;
}

interface DpBusinessDetailsProps { business: Business | null; }

export const DpBusinessDetails: React.FC<DpBusinessDetailsProps> = ({ business }) => {
  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}`, boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: dpColors.redSoft, color: dpColors.red }}><StoreIcon sx={{ fontSize: 18 }} /></Avatar>
          <Typography variant="h6" fontWeight={800} sx={{ color: dpColors.ink }}>Seller Details 🏢</Typography>
        </Stack>
        {business ? (
          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={800} sx={{ color: dpColors.ink }}>{business.businessName}</Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: dpColors.inkSub }}>GST: {business.gstNumber}</Typography>
              <Typography variant="caption" sx={{ color: dpColors.inkSub }}>📍 {business.address}, {business.city}</Typography>
              <Typography variant="caption" sx={{ color: dpColors.inkSub }}>🏛️ {business.state}, {business.pincode}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: '12px', backgroundColor: dpColors.redSoft, border: `2px solid ${dpColors.red}`, color: dpColors.red }}>Please set up your business profile - Maximum effort required! 🦸</Alert>
        )}
      </CardContent>
    </Card>
  );
};