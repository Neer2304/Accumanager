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
  Box,
} from '@mui/material';
import { Category } from '@mui/icons-material';

interface CustomerSegmentsProps {
  customerSegments: any[];
  currentColors: any;
}

export default function CustomerSegments({
  customerSegments,
  currentColors
}: CustomerSegmentsProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Customer Segments
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Segment
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Customers
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Value (₹)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerSegments.map((segment, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: currentColors.textPrimary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Category fontSize="small" />
                      {segment.segment}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: currentColors.textPrimary, fontWeight: 'medium' }}>
                    {segment.count}
                  </TableCell>
                  <TableCell align="right" sx={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
                    ₹{segment.value.toLocaleString()}
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