import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  TablePagination,
} from '@mui/material';

interface SkeletonTableProps {
  columns: number;
  rows?: number;
  hasActions?: boolean;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  columns,
  rows = 5,
  hasActions = true,
}) => {
  const totalColumns = hasActions ? columns + 1 : columns;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: totalColumns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};