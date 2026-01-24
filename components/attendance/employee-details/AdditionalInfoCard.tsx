import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  ContactEmergency as EmergencyIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolder: string;
}

interface AdditionalInfoCardProps {
  emergencyContact?: EmergencyContact;
  bankDetails?: BankDetails;
}

export const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
  emergencyContact,
  bankDetails,
}) => {
  if (!emergencyContact && !bankDetails) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Additional Info
        </Typography>
        
        {emergencyContact && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmergencyIcon fontSize="small" /> Emergency Contact
            </Typography>
            <Box sx={{ pl: 1.5 }}>
              <Typography variant="body2">
                {emergencyContact.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {emergencyContact.phone} • {emergencyContact.relation}
              </Typography>
            </Box>
          </Box>
        )}
        
        {bankDetails && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BankIcon fontSize="small" /> Bank Details
            </Typography>
            <Box sx={{ pl: 1.5 }}>
              <Typography variant="body2">
                {bankDetails.bankName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A/C: {bankDetails.accountNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IFSC: {bankDetails.ifscCode}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};