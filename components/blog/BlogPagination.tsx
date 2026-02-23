// components/blog/BlogPagination.tsx
import { Pagination, Box } from '@mui/material';

interface BlogPaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export default function BlogPagination({ page, count, onChange }: BlogPaginationProps) {
  if (count <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Pagination
        count={count}
        page={page}
        onChange={(e, newPage) => onChange(newPage)}
        color="primary"
        size="large"
      />
    </Box>
  );
}