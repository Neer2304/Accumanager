import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Chip,
} from "@mui/material";

interface BillCustomer {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state: string;
  pincode?: string;
  gstin?: string;
  isInterState: boolean;
}

interface CustomerDetailsProps {
  customer: BillCustomer;
  businessState?: string;
  onCustomerChange: (field: keyof BillCustomer, value: any) => void;
  onOpenSearch: () => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  businessState,
  onCustomerChange,
  onOpenSearch,
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Customer Details
          </Typography>
          <Button
            size="small"
            onClick={onOpenSearch}
          >
            Search Customer
          </Button>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Customer Name *"
            value={customer.name}
            onChange={(e) =>
              onCustomerChange("name", e.target.value)
            }
            size="small"
          />
          <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone *"
              value={customer.phone}
              onChange={(e) =>
                onCustomerChange("phone", e.target.value)
              }
              size="small"
            />
            <TextField
              fullWidth
              label="GSTIN"
              value={customer.gstin}
              onChange={(e) =>
                onCustomerChange("gstin", e.target.value)
              }
              size="small"
            />
          </Box>
          <TextField
            fullWidth
            label="State *"
            value={customer.state}
            onChange={(e) =>
              onCustomerChange("state", e.target.value)
            }
            size="small"
            placeholder="Enter customer state"
            required
          />
          <Box>
            <Chip
              label={
                customer.isInterState
                  ? "Inter-State Transaction (IGST)"
                  : "Intra-State Transaction (CGST+SGST)"
              }
              color={
                customer.isInterState ? "secondary" : "primary"
              }
              variant="outlined"
            />
            {businessState && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 0.5, color: "text.secondary" }}
              >
                Your business is in {businessState}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};