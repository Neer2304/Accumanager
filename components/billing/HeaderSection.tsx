import React from 'react';
import { Box, Typography, Paper } from "@mui/material";

interface HeaderSectionProps {
  isOnline: boolean;
  grandTotal: number;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  isOnline,
  grandTotal,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            🧾 Point of Sale
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {isOnline
              ? "Create professional invoices with GST calculations"
              : "Offline Mode - Bills saved locally"}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" fontWeight="bold">
            Grand Total
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            ₹{grandTotal.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};