import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export interface StatusItem {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

interface ReportStatusGridProps {
  items: StatusItem[];
  title?: string;
  columns?: number;
}

const ReportStatusGrid: React.FC<ReportStatusGridProps> = ({
  items,
  title = 'Status Overview',
  columns = 4,
}) => {
  return (
    <Box>
      {title && (
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((item, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: item.color,
              color: 'white',
              flex: `1 1 calc(${100 / columns}% - 16px)`,
              minWidth: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            {item.icon && (
              <Box sx={{ mb: 1, fontSize: 24 }}>
                {item.icon}
              </Box>
            )}
            <Typography variant="h4" fontWeight="bold">
              {item.value.toLocaleString()}
            </Typography>
            <Typography variant="body2">
              {item.label}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ReportStatusGrid;