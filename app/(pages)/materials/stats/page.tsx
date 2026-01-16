import { MaterialStats } from '@/components/material/components/MaterialStats';
import { Container, Paper, Typography } from '@mui/material';

export default function StatsPage() {
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>Material Statistics</Typography>
      <MaterialStats stats={null} />
    </Container>
  );
}