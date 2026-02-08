import { Box, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button, alpha } from '@mui/material'
import { Search, FilterList } from '@mui/icons-material'

interface SearchFiltersProps {
  search: string
  setSearch: (value: string) => void
  filter: string
  setFilter: (value: string) => void
  currentColors: any
  isMobile: boolean
  primaryColor: string
  alpha: any
}

export default function SearchFilters({
  search,
  setSearch,
  filter,
  setFilter,
  currentColors,
  isMobile,
  primaryColor,
  alpha
}: SearchFiltersProps) {
  return (
    <Card sx={{ 
      mb: 2, 
      background: currentColors.card,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }}>
      <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 1 : 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ 
                    color: currentColors.textSecondary,
                    fontSize: isMobile ? 18 : 20
                  }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                fontSize: isMobile ? '0.875rem' : '1rem',
              }
            }}
            sx={{
              background: currentColors.surface,
              minWidth: isMobile ? '100%' : '300px',
              flex: 1,
              '& .MuiOutlinedInput-root': {
                color: currentColors.textPrimary,
                '& fieldset': {
                  borderColor: currentColors.border,
                },
                '&:hover fieldset': {
                  borderColor: primaryColor,
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
            }}
          />

          <FormControl sx={{ 
            minWidth: isMobile ? '120px' : '150px' 
          }} size={isMobile ? "small" : "medium"}>
            <InputLabel sx={{ 
              color: currentColors.textSecondary,
              fontSize: isMobile ? '0.875rem' : '1rem',
              '&.Mui-focused': {
                color: primaryColor,
              }
            }}>
              Filter
            </InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
              sx={{
                background: currentColors.surface,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                fontSize: isMobile ? '0.875rem' : '1rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: currentColors.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: primaryColor,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: primaryColor,
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
            </Select>
          </FormControl>

          {!isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                border: `1px solid ${currentColors.border}`,
                color: currentColors.textPrimary,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: currentColors.hover,
                }
              }}
            >
              More Filters
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}