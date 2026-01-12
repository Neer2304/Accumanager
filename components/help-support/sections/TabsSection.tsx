import React from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

interface TabsSectionProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const TabsSection = ({ value, onChange }: TabsSectionProps) => {
  const { tabs } = HELP_SUPPORT_CONTENT;

  return (
    <Paper sx={{ mb: 4 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<HelpSupportIcon name="Whatshot" />} label={tabs.quickHelp} />
        <Tab icon={<HelpSupportIcon name="Article" />} label={tabs.documentation} />
        <Tab icon={<HelpSupportIcon name="Message" />} label={tabs.contactSupport} />
        <Tab icon={<HelpSupportIcon name="Video" />} label={tabs.videoGuides} />
      </Tabs>
    </Paper>
  );
};