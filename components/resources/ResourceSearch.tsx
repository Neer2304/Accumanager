// components/resources/ResourceSearch.tsx - FIXED VERSION
import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ResourceItem } from './data/resourcesData';

interface ResourceSearchProps {
  onSearch: (query: string) => void;
  searchResults?: ResourceItem[];
  allResources?: ResourceItem[];
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  onSearch,
  searchResults,
  allResources = [],
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular searches based on actual usage
  const popularSearches = [
    'How to add employee',
    'Create new project',
    'Upload product images',
    'Generate reports',
    'Mark attendance',
    'Manage stock levels',
    'Schedule events',
    'Assign tasks'
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <TextField
        fullWidth
        placeholder="Search for help topics, guides, or templates..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: 'background.paper',
            fontSize: '1.1rem',
            height: 56,
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.3),
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                color={query ? "primary" : "action"} 
                sx={{ 
                  color: query ? theme.palette.primary.main : theme.palette.action.active 
                }}
              />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={clearSearch}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search Suggestions */}
      {showSuggestions && !searchResults && query.length === 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 1000,
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
          }}
        >
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
              Popular Searches
            </Typography>
          </Box>
          <List sx={{ py: 0 }}>
            {popularSearches.map((search, index) => (
              <React.Fragment key={search}>
                <ListItem 
                  disablePadding
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemButton 
                    onClick={() => handleSuggestionClick(search)}
                    sx={{
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemText
                      primary={search}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.primary',
                        sx: { 
                          '&:hover': { 
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          } 
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < popularSearches.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Search Results */}
      {showSuggestions && searchResults && searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 1000,
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[4],
          }}
        >
          <Box sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <List sx={{ py: 0, maxHeight: 300, overflow: 'auto' }}>
            {searchResults.slice(0, 8).map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem 
                  disablePadding
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <ListItemButton 
                    sx={{
                      py: 1.5,
                      px: 2,
                    }}
                    onClick={() => {
                      // You can add navigation to the specific resource here
                      console.log('Navigate to:', result.id);
                      setShowSuggestions(false);
                    }}
                  >
                    <ListItemText
                      primary={result.title}
                      secondary={`${result.module} • ${result.type}`}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < searchResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {searchResults.length > 8 && (
              <Box sx={{ p: 2, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary">
                  {searchResults.length - 8} more results...
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};