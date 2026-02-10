import React from 'react';
import { Typography } from '@mui/material';
import { REVIEWS_CONTENT } from '../ReviewsContent';

interface HeaderSectionProps {
  darkMode?: boolean;
}

export const HeaderSection = ({ darkMode = false }: HeaderSectionProps) => {
  const { header } = REVIEWS_CONTENT;

  return (
    <div style={{ display: 'none' }} />
  );
};