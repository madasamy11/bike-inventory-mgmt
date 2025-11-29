import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import InventoryTable from "../components/InventoryTable";
import InventoryForm from "../components/InventoryForm";
import Footer from "../components/Footer";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

export default function Inventory() {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "" });

  useEffect(() => {
    api.get("/bikes")
      .then(res => setBikes(res.data))
      .catch(() => setSnack({ open: true, message: "Failed to load bikes" }));
  }, []);

  const handleAdd = () => {
    setEdit(null);
    setOpen(true);
  };

  const handleEdit = bike => {
    setEdit(bike);
    setOpen(true);
  };

  const handleDelete = async _id => {
    try {
      await api.delete(`/bikes/${_id}`);
      setBikes(bikes.filter(b => b._id !== _id));
      setSnack({ open: true, message: "Bike deleted" });
    } catch {
      setSnack({ open: true, message: "Delete failed" });
    }
  };

  const handleSave = async data => {
    if (edit) {
      try {
        const res = await api.put(`/bikes/${edit._id}`, data);
        setBikes(bikes.map(b => (b._id === edit._id ? res.data : b)));
        setSnack({ open: true, message: "Bike updated" });
      } catch {
        setSnack({ open: true, message: "Update failed" });
      }
    } else {
      try {
        const res = await api.post("/bikes", data);
        setBikes([...bikes, res.data]);
        setSnack({ open: true, message: "Bike added" });
      } catch {
        setSnack({ open: true, message: "Add failed" });
      }
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxWidth="md" sx={{ flex: 1, py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={700}>Inventory</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ borderRadius: 2, fontWeight: 600, boxShadow: 2, px: 3, py: 1, fontSize: 16 }}
          >
            Add Bike
          </Button>
        </Box>
        <InventoryTable bikes={bikes} onEdit={handleEdit} onDelete={handleDelete} />
        <InventoryForm open={open} setOpen={setOpen} initial={edit} onSave={handleSave} />
        <Snackbar
          open={snack.open}
          autoHideDuration={2500}
          onClose={() => setSnack({ ...snack, open: false })}
          message={snack.message}
        />
      </Container>
      <Footer />
    </Box>
  );
}
