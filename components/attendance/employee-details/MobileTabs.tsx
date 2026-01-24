import React from 'react';
import { Box, Button } from '@mui/material';

interface MobileTabsProps {
  sections: { id: string; label: string }[];
  expandedSection: string | null;
  onSectionClick: (section: string) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  sections,
  expandedSection,
  onSectionClick,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      mb: 2,
      borderBottom: 1,
      borderColor: 'divider',
      overflow: 'auto',
      '&::-webkit-scrollbar': { display: 'none' },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    }}>
      {sections.map(({ id, label }) => (
        <Button
          key={id}
          onClick={() => onSectionClick(id)}
          sx={{
            flex: 1,
            minWidth: 'fit-content',
            borderRadius: 0,
            borderBottom: expandedSection === id ? 2 : 0,
            borderColor: 'primary.main',
            py: 1.5,
            color: expandedSection === id ? 'primary.main' : 'text.secondary',
            fontWeight: expandedSection === id ? 'bold' : 'normal',
            whiteSpace: 'nowrap',
            px: 2,
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};