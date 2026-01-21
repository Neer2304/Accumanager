import { Box, Typography, Stack } from '@mui/material';

export default function Watchlist({ prices, selected, onSelect }: any) {
  const stocks = Object.keys(prices);

  return (
    <Box sx={{ bgcolor: '#1e2329', borderRadius: 2, overflow: 'hidden' }}>
      <Typography sx={{ p: 2, fontWeight: 'bold', borderBottom: '1px solid #2b3139' }}>Market Watch</Typography>
      {stocks.map((s) => (
        <Stack
          key={s}
          direction="row"
          justifyContent="space-between"
          onClick={() => onSelect(s)}
          sx={{
            p: 2,
            cursor: 'pointer',
            borderBottom: '1px solid #2b3139',
            bgcolor: selected === s ? '#2b3139' : 'transparent',
            '&:hover': { bgcolor: '#2b3139' }
          }}
        >
          <Typography fontWeight="bold">{s}</Typography>
          <Typography color={prices[s] > 100 ? '#2ebd85' : '#f6465d'}>
            ${prices[s].toFixed(2)}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}