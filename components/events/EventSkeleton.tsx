import { Box, Card, CardContent } from "@mui/material";

export const EventSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        },
        gap: 3,
      }}
    >
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <Card
            key={index}
            sx={{ borderRadius: 2, animation: "pulse 2s infinite" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  height: 24,
                  bgcolor: "grey.300",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  mb: 1,
                  width: "80%",
                }}
              />
              <Box
                sx={{
                  height: 16,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  width: "60%",
                }}
              />
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};