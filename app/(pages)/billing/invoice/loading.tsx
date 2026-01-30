// app/billing/invoice/loading.tsx
import { Box, Container, Skeleton, Grid } from "@mui/material";

export default function InvoiceLoading() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" />
        </Box>
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>

      {/* Filters Skeleton */}
      <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 4 }} />

      {/* Table Skeleton */}
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </Container>
  );
}