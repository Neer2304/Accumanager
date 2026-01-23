import React from 'react';
import { Card, CardContent, Typography, Box, Alert } from "@mui/material";
import { ReceiptIcon } from "@/assets/icons/BillingIcons";

interface Business {
  businessName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BusinessDetailsProps {
  business: Business | null;
}

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business }) => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ReceiptIcon sx={{ mr: 1 }} />
          Seller Details
        </Typography>
        {business ? (
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {business.businessName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              GST: {business.gstNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.address}, {business.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.state}, {business.pincode}
            </Typography>
          </Box>
        ) : (
          <Alert severity="info">
            Please set up your business profile in settings.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};