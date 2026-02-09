import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableProps,
} from '@mui/material'

interface AdminTableProps extends TableProps {
  headers: string[]
  children: React.ReactNode
}

export default function AdminTable({ headers, children, ...props }: AdminTableProps) {
  return (
    <TableContainer 
      component={Paper} 
      variant="outlined"
      sx={{ 
        borderRadius: 2,
        borderColor: 'divider',
      }}
    >
      <Table {...props}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {headers.map((header, index) => (
              <TableCell 
                key={index}
                sx={{ 
                  fontWeight: 600,
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </TableContainer>
  )
}