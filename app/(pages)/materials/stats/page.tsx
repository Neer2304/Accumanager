'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Box,
  Alert,
  Button 
} from '@mui/material';
import { MaterialStats } from '@/components/material/components/MaterialStats';
import { Refresh } from '@mui/icons-material';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/material/stats');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error fetching statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  const handleExport = () => {
    console.log('Exporting statistics...');
    // Add export logic here
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '70vh',
          flexDirection: 'column',
          gap: 3
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Material Statistics</Typography>
          <Alert 
            severity="error"
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchStats}
                startIcon={<Refresh />}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4">Material Statistics</Typography>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        <MaterialStats 
          stats={stats}
          loading={loading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      </Box>
    </Container>
  );
}