import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BrandForm from "../components/BrandForm";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { formatCurrency } from "../utils/formatters";
import { exportBikesToExcel } from "../utils/excelExport";

export default function Home({ onBrandClick }) {
  const [brands, setBrands] = useState([]);
  const [summary, setSummary] = useState({ totalBrands: 0, totalQuantity: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsRes, summaryRes] = await Promise.all([
        api.get("/brands"),
        api.get("/brands/summary")
      ]);
      setBrands(brandsRes.data);
      setSummary(summaryRes.data);
    } catch {
      setSnack({ open: true, message: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEdit(null);
    setOpen(true);
  };

  const handleEdit = (brand, e) => {
    e.stopPropagation();
    setEdit(brand);
    setOpen(true);
  };

  const handleSave = async (data) => {
    if (edit) {
      try {
        await api.put(`/brands/${edit._id}`, data);
        setSnack({ open: true, message: "Brand updated" });
        fetchData();
      } catch {
        setSnack({ open: true, message: "Update failed" });
      }
    } else {
      try {
        await api.post("/brands", data);
        setSnack({ open: true, message: "Brand added" });
        fetchData();
      } catch {
        setSnack({ open: true, message: "Add failed" });
      }
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all bikes from the API
      const response = await api.get("/bikes");
      const bikes = response.data;
      
      // Export to Excel
      exportBikesToExcel(bikes);
      setSnack({ open: true, message: "Inventory exported successfully" });
    } catch (error) {
      const message = error.message === 'No data available to export' 
        ? "No inventory data to export" 
        : "Failed to export inventory";
      setSnack({ open: true, message });
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Summary Stats */}
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={700}>{summary.totalBrands}</Typography>
                <Typography variant="subtitle1">Total Brands</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={700}>{summary.totalQuantity}</Typography>
                <Typography variant="subtitle1">Total Items</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={700}>{formatCurrency(summary.totalAmount)}</Typography>
                <Typography variant="subtitle1">Total Amount</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Header with Add Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700}>Brands</Typography>
          <Box display="flex" gap={2}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Brand
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export Backup
            </Button>
          </Box>
        </Box>

        {/* Brand Folders Grid */}
        {loading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading brands...
            </Typography>
          </Box>
        ) : brands.length === 0 ? (
          <Box textAlign="center" py={8}>
            <FolderIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No brands added yet. Click "Add Brand" to get started.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {brands.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={brand._id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea onClick={() => onBrandClick(brand.name)}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <FolderIcon 
                          sx={{ 
                            fontSize: 80, 
                            color: '#1e3c72',
                            mb: 1
                          }} 
                        />
                        <IconButton 
                          size="small"
                          aria-label="Edit brand"
                          onClick={(e) => handleEdit(brand, e)}
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: -10,
                            bgcolor: 'white',
                            boxShadow: 1,
                            '&:hover': { bgcolor: 'grey.100' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {brand.name}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {brand.totalQuantity} items
                        </Typography>
                        <Typography variant="body1" fontWeight={500} color="primary">
                          {formatCurrency(brand.totalAmount)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <BrandForm open={open} setOpen={setOpen} initial={edit} onSave={handleSave} />
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
