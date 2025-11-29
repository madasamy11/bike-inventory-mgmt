import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InventoryTable({ bikes, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, boxShadow: 2, p: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
            <TableCell sx={{ color: '#f9f6f6ff', fontWeight: 600, fontSize: 15 }}>Brand</TableCell>
            <TableCell sx={{ color: '#f9f6f6ff', fontWeight: 600, fontSize: 15 }}>Model</TableCell>
            <TableCell sx={{ color: '#f9f6f6ff', fontWeight: 600, fontSize: 15 }}>Year</TableCell>
            <TableCell sx={{ color: '#f9f6f6ff', fontWeight: 600, fontSize: 15 }}>Price</TableCell>
            <TableCell sx={{ color: '#f9f6f6ff', fontWeight: 600, fontSize: 15, textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bikes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4, fontSize: 17, color: '#888' }}>
                No bikes found.
              </TableCell>
            </TableRow>
          ) : (
            bikes.map((bike) => (
              <TableRow key={bike._id} hover sx={{ transition: 'background 0.2s', '&:hover': { backgroundColor: '#e3e8ee' } }}>
                <TableCell sx={{ fontWeight: 400 }}>{bike.brand}</TableCell>
                <TableCell sx={{ fontWeight: 400 }}>{bike.model}</TableCell>
                <TableCell sx={{ fontWeight: 400 }}>{bike.year}</TableCell>
                <TableCell sx={{ fontWeight: 400 }}>₹{bike.price}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton aria-label="Edit bike" color="primary" variant="outlined" onClick={() => onEdit(bike)} sx={{ mx: 0.5, border: '1px solid #90caf9', background: '#fff' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="Delete bike" color="error" variant="outlined" onClick={() => onDelete(bike._id)} sx={{ mx: 0.5, border: '1px solid #f44336', background: '#fff' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
