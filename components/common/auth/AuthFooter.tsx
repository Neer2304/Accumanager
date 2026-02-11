'use client';

import React from 'react';
import { Box, Typography, Link as MuiLink, Stack, Divider, useTheme } from '@mui/material';
import Link from 'next/link';

interface FooterLink {
  text: string;
  href: string;
}

interface AuthFooterProps {
  primaryText?: string;
  primaryLink?: FooterLink;
  secondaryText?: string;
  secondaryLink?: FooterLink;
  showSecurityFeatures?: boolean;
}

const AuthFooter: React.FC<AuthFooterProps> = ({
  primaryText = "Don't have an account?",
  primaryLink = { text: 'Sign Up', href: '/auth/register' },
  secondaryText = 'Forgot password?',
  secondaryLink = { text: 'Reset here', href: '/auth/forgot-password' },
  showSecurityFeatures = false,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const renderLink = (link: FooterLink) => (
    <MuiLink
      component={Link}
      href={link.href}
      sx={{
        color: darkMode ? '#8ab4f8' : '#1a73e8',
        textDecoration: 'none',
        fontWeight: 600,
        position: 'relative',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {link.text}
    </MuiLink>
  );

  return (
    <>
      <Stack spacing={2} sx={{ mt: 4, textAlign: 'center' }}>
        {primaryText && primaryLink && (
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {primaryText} {renderLink(primaryLink)}
          </Typography>
        )}

        {secondaryText && secondaryLink && (
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
            {secondaryText} {renderLink(secondaryLink)}
          </Typography>
        )}
      </Stack>

      {showSecurityFeatures && (
        <>
          <Divider sx={{ my: 3, borderColor: darkMode ? '#3c4043' : '#dadce0' }} />

          <Stack direction="row" spacing={3} justifyContent="center">
            {[
              { icon: '🔐', text: '256-bit SSL' },
              { icon: '👁️', text: '2FA Ready' },
              { icon: '📊', text: 'Activity Logs' },
            ].map((feature, index) => (
              <Stack
                key={index}
                alignItems="center"
                spacing={0.5}
                sx={{
                  opacity: 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                  {feature.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </>
  );
};

export default AuthFooter;