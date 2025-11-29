import { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const BRANDS = ["Honda", "Yamaha", "TVS", "Hero", "Suzuki", "Royal Enfield"];
const CONDITIONS = ["Great", "Good", "Average"];
const STATUS = ["Available", "Sold"];

const DEFAULT_FORM = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  licensePlate: "",
  price: "",
  condition: "",
  status: "",
  images: "",
  inDate: new Date().toISOString().slice(0, 10),
  outDate: "",
  notes: ""
};

export default function InventoryForm({ open, setOpen, initial, onSave, fixedBrand }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (open) {
      if (initial) {
        // Editing existing bike → merge with defaults
        setForm({ ...DEFAULT_FORM, ...initial });
      } else {
        // Adding new bike → reset to defaults, set fixedBrand if provided
        setForm({ ...DEFAULT_FORM, brand: fixedBrand || "" });
      }
    }
  }, [open, initial, fixedBrand]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "status" && value !== "Sold") {
      // Clear outDate when status is not Sold
      setForm(f => ({ ...f, [name]: value, outDate: "" }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleOutDateFocus = () => {
    // Set status to Sold when outDate field is focused
    setForm(f => ({ ...f, status: "Sold" }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { _id, ...data } = form; 
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, background: '#f5f5f5', borderRadius: 2 }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 20, color: '#222', mb: 1 }}>{initial ? "Edit" : "Add New"} Bike</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 2 }}>
            <TextField
              select
              name="brand"
              label="Brand"
              value={form.brand}
              onChange={handleChange}
              required
              fullWidth
              disabled={!!fixedBrand}
              variant="outlined"
              sx={{ background: '#fff', borderRadius: 1 }}
            >
              {BRANDS.map(b => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
              {fixedBrand && !BRANDS.includes(fixedBrand) && (
                <MenuItem key={fixedBrand} value={fixedBrand}>{fixedBrand}</MenuItem>
              )}
              {!fixedBrand && form.brand && !BRANDS.includes(form.brand) && (
                <MenuItem key={form.brand} value={form.brand}>{form.brand}</MenuItem>
              )}
            </TextField>
            <TextField name="model" label="Model" value={form.model} onChange={handleChange} required fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField name="licensePlate" label="License Plate" value={form.licensePlate} onChange={handleChange} fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField name="year" label="Year" type="number" value={form.year} onChange={handleChange} required fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField name="price" label="Price" type="number" value={form.price} onChange={handleChange} required fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField
              select
              name="condition"
              label="Condition"
              value={form.condition}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ background: '#fff', borderRadius: 1 }}
            >
              {CONDITIONS.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="status"
              label="Status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ background: '#fff', borderRadius: 1 }}
            >
              {STATUS.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField name="images" label="Images" value={form.images} disabled fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField name="inDate" label="InDate" type="date" value={form.inDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
            <TextField 
              name="outDate" 
              label="OutDate" 
              type="date" 
              value={form.outDate} 
              onChange={handleChange}
              onFocus={handleOutDateFocus}
              disabled={form.status !== "Sold"}
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              variant="outlined"
              sx={{ background: '#fff', borderRadius: 1 }}
            />
            <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} multiline rows={2} placeholder="Enter things to remember" fullWidth variant="outlined" sx={{ background: '#fff', borderRadius: 1 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit" variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}