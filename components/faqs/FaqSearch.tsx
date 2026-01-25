// components/faqs/FaqSearch.tsx
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
import { FaqIcons } from './icons/FaqIcons';
import { popularQuestions } from './content/FaqContent';

interface FaqSearchProps {
  onSearch: (query: string) => void;
  searchResults?: Array<{ id: string; question: string; category: string }>;
}

export const FaqSearch: React.FC<FaqSearchProps> = ({ onSearch, searchResults }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const SearchIcon = FaqIcons.search;
  const StarIcon = FaqIcons.star;
  const ExpandLessIcon = FaqIcons.expandLess;

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
        placeholder="Search for answers..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <ExpandLessIcon sx={{ transform: 'rotate(45deg)' }} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            fontSize: '1.1rem',
            height: 56,
          }
        }}
      />

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
          }}
        >
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon fontSize="small" />
              Popular Questions
            </Typography>
          </Box>
          <List>
            {popularQuestions.map((question, index) => (
              <React.Fragment key={question}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSuggestionClick(question)}>
                    <ListItemText
                      primary={question}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { '&:hover': { color: theme.palette.primary.main } }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < popularQuestions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

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
          }}
        >
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <List>
            {searchResults.map((result, index) => (
              <React.Fragment key={result.id}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={result.question}
                      secondary={`In: ${result.category}`}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
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
          </List>
        </Paper>
      )}
    </Box>
  );
};