import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
} from '@mui/material';
import { Payment } from '@mui/icons-material';

interface PaymentMethodTableProps {
  revenueByMethod: any[];
  currentColors: any;
  primaryColor: string;
}

export default function PaymentMethodTable({
  revenueByMethod,
  currentColors,
  primaryColor
}: PaymentMethodTableProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Revenue by Payment Method
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Method
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Amount (₹)
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueByMethod.map((method, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: currentColors.textPrimary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payment fontSize="small" />
                      {method.method}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: currentColors.textPrimary, fontWeight: 'medium' }}>
                    ₹{method.amount.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${method.percentage}%`}
                      size="small"
                      sx={{
                        background: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1)`,
                        color: primaryColor,
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}