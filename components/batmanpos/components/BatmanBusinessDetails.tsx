// components/batmanpos/components/BatmanBusinessDetails.tsx
'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Alert, Avatar, Stack } from "@mui/material";
import { Store as StoreIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface Business {
  businessName: string; gstNumber: string; address: string; city: string; state: string; pincode: string;
}

interface BatmanBusinessDetailsProps { business: Business | null; }

export const BatmanBusinessDetails: React.FC<BatmanBusinessDetailsProps> = ({ business }) => {
  return (
    <Card sx={{ borderRadius: '20px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}`, boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><StoreIcon sx={{ fontSize: 18 }} /></Avatar>
          <Typography variant="h6" fontWeight={800} sx={{ color: batmanColors.gold, letterSpacing: '0.05em' }}>Wayne Enterprises 🏢</Typography>
        </Stack>
        {business ? (
          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={800} sx={{ color: batmanColors.ink }}>{business.businessName}</Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>GST: {business.gstNumber}</Typography>
              <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>📍 {business.address}, {business.city}</Typography>
              <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>🏛️ {business.state}, {business.pincode}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: '12px', backgroundColor: batmanColors.goldSoft, border: `2px solid ${batmanColors.gold}`, color: batmanColors.gold }}>Please set up your business profile - Gotham depends on it! 🦇</Alert>
        )}
      </CardContent>
    </Card>
  );
};