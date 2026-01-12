import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

export const BreadcrumbsSection = () => {
  const { breadcrumbs } = HELP_SUPPORT_CONTENT;

  return (
    <Breadcrumbs sx={{ mb: 3 }}>
      <Link
        href="/"
        underline="hover"
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HelpSupportIcon name="Home" sx={{ mr: 0.5 }} size="small" />
        {breadcrumbs.home}
      </Link>
      <Typography
        color="text.primary"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HelpSupportIcon name="Support" sx={{ mr: 0.5 }} size="small" />
        {breadcrumbs.helpSupport}
      </Typography>
    </Breadcrumbs>
  );
};