// components/common/Text/index.tsx
import React from 'react';
import { Typography, TypographyProps, Box } from '@mui/material';

interface TextProps extends TypographyProps {
  children: React.ReactNode;
}

export const Heading1: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="h1" fontSize={{ xs: '2rem', md: '2.5rem' }} fontWeight={700} {...props}>
    {children}
  </Typography>
);

export const Heading2: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="h2" fontSize={{ xs: '1.75rem', md: '2rem' }} fontWeight={600} {...props}>
    {children}
  </Typography>
);

export const Heading3: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="h3" fontSize={{ xs: '1.5rem', md: '1.75rem' }} fontWeight={600} {...props}>
    {children}
  </Typography>
);

export const Heading4: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="h4" fontSize={{ xs: '1.25rem', md: '1.5rem' }} fontWeight={600} {...props}>
    {children}
  </Typography>
);

export const BodyText: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="body1" fontSize={{ xs: '0.875rem', md: '1rem' }} {...props}>
    {children}
  </Typography>
);

export const CaptionText: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="caption" fontSize={{ xs: '0.75rem', md: '0.875rem' }} {...props}>
    {children}
  </Typography>
);

export const SectionTitle: React.FC<TextProps> = ({ children, ...props }) => (
  <Box mb={3}>
    <Typography variant="h5" fontWeight="bold" gutterBottom {...props}>
      {children}
    </Typography>
  </Box>
);

export const ErrorText: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="body2" color="error" {...props}>
    {children}
  </Typography>
);

export const SuccessText: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="body2" color="success.main" {...props}>
    {children}
  </Typography>
);

export const MutedText: React.FC<TextProps> = ({ children, ...props }) => (
  <Typography variant="body2" color="text.secondary" {...props}>
    {children}
  </Typography>
);