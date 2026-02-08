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
import { CalendarToday, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface RevenueForecastProps {
  forecast: any[];
  currentColors: any;
  googleColors: any;
}

export default function RevenueForecast({
  forecast,
  currentColors,
  googleColors
}: RevenueForecastProps) {
  return (
    <Card sx={{ 
      background: currentColors.card, 
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      height: '100%',
    }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3} color={currentColors.textPrimary}>
          Revenue Forecast
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Month
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Forecasted Revenue
                </TableCell>
                <TableCell align="right" sx={{ color: currentColors.textSecondary, fontWeight: 'bold' }}>
                  Growth
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecast.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: currentColors.textPrimary }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" />
                      {item.month} {item.year ? item.year : ''}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: currentColors.textPrimary, fontWeight: 'bold' }}>
                    ₹{item.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      icon={item.growth > 0 ? <ArrowUpward /> : <ArrowDownward />}
                      label={`${item.growth > 0 ? '+' : ''}${item.growth}%`}
                      size="small"
                      sx={{
                        background: `rgba(${item.growth > 0 ? '52, 168, 83' : '234, 67, 53'}, 0.1)`,
                        color: item.growth > 0 ? googleColors.green : googleColors.red,
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