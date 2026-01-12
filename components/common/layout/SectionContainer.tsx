import React from 'react';
import { Paper, PaperProps } from '@mui/material';

interface SectionContainerProps extends PaperProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  headerAction,
  noPadding = false,
  children,
  sx,
  ...props
}) => {
  return (
    <Paper
      sx={{
        p: noPadding ? 0 : 3,
        borderRadius: 3,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {(title || headerAction) && (
        <Paper
          elevation={0}
          sx={{
            p: noPadding ? 3 : 0,
            pb: 3,
            bgcolor: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            {title && (
              <h3 style={{ margin: 0, marginBottom: subtitle ? 4 : 0 }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction}
        </Paper>
      )}

      <div style={{ padding: noPadding ? '0 24px 24px' : 0 }}>
        {children}
      </div>
    </Paper>
  );
};

export default SectionContainer;