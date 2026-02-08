"use client";

import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  Link as MuiLink,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LegalMarkdownProps {
  content: string;
  darkMode?: boolean;
}

export const LegalMarkdown: React.FC<LegalMarkdownProps> = ({ content, darkMode = false }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <Typography 
            variant="h4" 
            sx={{ 
              mt: 4, 
              mb: 2, 
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography 
            variant="h5" 
            sx={{ 
              mt: 3, 
              mb: 1.5, 
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2, 
              mb: 1, 
              color: darkMode ? '#e8eaed' : '#202124',
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {children}
          </Typography>
        ),
        p: ({ children }) => (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.8,
              color: darkMode ? '#e8eaed' : '#202124',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <List 
            sx={{ 
              pl: 2, 
              mb: 2,
              listStyleType: 'disc',
            }}
          >
            {children}
          </List>
        ),
        ol: ({ children }) => (
          <List 
            component="ol"
            sx={{ 
              pl: 2, 
              mb: 2,
              listStyleType: 'decimal',
            }}
          >
            {children}
          </List>
        ),
        li: ({ children }) => (
          <ListItem sx={{ 
            display: 'list-item', 
            p: 0,
            mb: 0.5,
          }}>
            <ListItemIcon sx={{ 
              minWidth: 24, 
              mt: 0.5,
              mr: 1,
            }}>
              <ChevronRight sx={{ 
                fontSize: 16, 
                color: darkMode ? '#5f6368' : '#9aa0a6',
              }} />
            </ListItemIcon>
            <Typography 
              variant="body1" 
              sx={{ 
                color: darkMode ? '#e8eaed' : '#202124',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {children}
            </Typography>
          </ListItem>
        ),
        strong: ({ children }) => (
          <Typography 
            component="span" 
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            {children}
          </Typography>
        ),
        em: ({ children }) => (
          <Typography 
            component="span" 
            sx={{ 
              fontStyle: 'italic',
              color: darkMode ? '#e8eaed' : '#202124',
            }}
          >
            {children}
          </Typography>
        ),
        code: ({ children }) => (
          <Box
            component="code"
            sx={{
              fontFamily: 'monospace',
              backgroundColor: darkMode ? '#303134' : '#f1f3f4',
              color: darkMode ? '#e8eaed' : '#202124',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875em',
            }}
          >
            {children}
          </Box>
        ),
        a: ({ children, href }) => (
          <MuiLink 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              color: darkMode ? '#8ab4f8' : '#1a73e8',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            {children}
          </MuiLink>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};