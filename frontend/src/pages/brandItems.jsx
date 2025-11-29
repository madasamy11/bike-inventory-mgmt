import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InventoryTable from "../components/InventoryTable";
import InventoryForm from "../components/InventoryForm";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function BrandItems({ brandName, onBack }) {
  const [bikes, setBikes] = useState([]);
  const [stats, setStats] = useState({ totalQuantity: 0, totalAmount: 0 });
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "" });

  const fetchData = useCallback(async () => {
    try {
      const [bikesRes, statsRes] = await Promise.all([
        api.get(`/brands/${encodeURIComponent(brandName)}/bikes`),
        api.get(`/brands/${encodeURIComponent(brandName)}/stats`)
      ]);
      setBikes(bikesRes.data);
      setStats(statsRes.data);
    } catch {
      setSnack({ open: true, message: "Failed to load data" });
    }
  }, [brandName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEdit(null);
    setOpen(true);
  };

  const handleEdit = (bike) => {
    setEdit(bike);
    setOpen(true);
  };

  const handleDelete = async (_id) => {
    try {
      await api.delete(`/bikes/${_id}`);
      setBikes(bikes.filter(b => b._id !== _id));
      setSnack({ open: true, message: "Bike deleted" });
      fetchData();
    } catch {
      setSnack({ open: true, message: "Delete failed" });
    }
  };

  const handleSave = async (data) => {
    // Ensure the brand is set to the current brand
    const bikeData = { ...data, brand: brandName };
    
    if (edit) {
      try {
        const res = await api.put(`/bikes/${edit._id}`, bikeData);
        setBikes(bikes.map(b => (b._id === edit._id ? res.data : b)));
        setSnack({ open: true, message: "Bike updated" });
        fetchData();
      } catch {
        setSnack({ open: true, message: "Update failed" });
      }
    } else {
      try {
        const res = await api.post("/bikes", bikeData);
        setBikes([...bikes, res.data]);
        setSnack({ open: true, message: "Bike added" });
        fetchData();
      } catch {
        setSnack({ open: true, message: "Add failed" });
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          Back to Brands
        </Button>

        {/* Brand Stats Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4" fontWeight={700}>{brandName}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={700}>{stats.totalQuantity}</Typography>
                <Typography variant="subtitle1">Total Items</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={700}>{formatCurrency(stats.totalAmount)}</Typography>
                <Typography variant="subtitle1">Total Amount</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Header with Add Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>Inventory</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Bike
          </Button>
        </Box>

        {/* Inventory Table */}
        <InventoryTable bikes={bikes} onEdit={handleEdit} onDelete={handleDelete} />

        <InventoryForm 
          open={open} 
          setOpen={setOpen} 
          initial={edit} 
          onSave={handleSave}
          fixedBrand={brandName}
        />
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
