import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
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
  const renderLink = (link: FooterLink) => (
    <MuiLink
      component={Link}
      href={link.href}
      sx={{ 
        textDecoration: 'none',
        fontWeight: '600',
        color: '#667eea',
        position: 'relative',
        padding: '0 4px',
        cursor: 'pointer',
        '&:hover': {
          color: '#f093fb',
          '&::after': {
            width: '100%',
            left: 0,
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -2,
          left: '50%',
          width: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #667eea, #f093fb)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      {link.text}
    </MuiLink>
  );

  return (
    <>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        {primaryText && primaryLink && (
          <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
            {primaryText}{' '}
            {renderLink(primaryLink)}
          </Typography>
        )}

        {secondaryText && secondaryLink && (
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {secondaryText}{' '}
            {renderLink(secondaryLink)}
          </Typography>
        )}
      </Box>

      {showSecurityFeatures && (
        <Box sx={{ 
          mt: 5, 
          pt: 3, 
          borderTop: '1px solid', 
          borderColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
        }}>
          {[
            { icon: '🔐', text: '256-bit SSL' },
            { icon: '👁️', text: '2FA Ready' },
            { icon: '📊', text: 'Activity Logs' },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                opacity: 0.7,
                transition: 'all 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  opacity: 1,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography sx={{ fontSize: '1.2rem' }}>{feature.icon}</Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default AuthFooter;