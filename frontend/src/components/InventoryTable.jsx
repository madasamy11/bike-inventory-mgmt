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
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>InDate</TableCell>
            <TableCell>OutDate</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bikes.map((bike) => (
            <TableRow key={bike._id} hover>
              <TableCell>{bike.brand}</TableCell>
              <TableCell>{bike.model}</TableCell>
              <TableCell>{bike.year}</TableCell>
              <TableCell>₹{bike.price}</TableCell>
              <TableCell>{bike.condition}</TableCell>
              <TableCell>{bike.status}</TableCell>
              <TableCell>{bike.inDate ? new Date(bike.inDate).toLocaleDateString() : "-"}</TableCell>
              <TableCell>{bike.outDate ? new Date(bike.outDate).toLocaleDateString() : "-"}</TableCell>
              <TableCell>{bike.notes}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(bike)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(bike._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
