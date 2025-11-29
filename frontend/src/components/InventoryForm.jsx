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
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <DialogTitle>{initial ? "Edit" : "Add New"} Bike</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <TextField
                select
                name="brand"
                label="Brand"
                value={form.brand}
                onChange={handleChange}
                required
                fullWidth
                disabled={!!fixedBrand}
              >
                {BRANDS.map(b => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
                {fixedBrand && !BRANDS.includes(fixedBrand) && (
                  <MenuItem key={fixedBrand} value={fixedBrand}>{fixedBrand}</MenuItem>
                )}
              </TextField>
            </Box>
            <TextField name="model" label="Model" value={form.model} onChange={handleChange} required fullWidth />
            <TextField name="licensePlate" label="License Plate" value={form.licensePlate} onChange={handleChange} required fullWidth />
            <TextField name="year" label="Year" type="number" value={form.year} onChange={handleChange} required fullWidth />
            <TextField name="price" label="Price" type="number" value={form.price} onChange={handleChange} required fullWidth />
            <Box>
              <TextField
                select
                name="condition"
                label="Condition"
                value={form.condition}
                onChange={handleChange}
                required
                fullWidth
              >
                {CONDITIONS.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <TextField
                select
                name="status"
                label="Status"
                value={form.status}
                onChange={handleChange}
                required
                fullWidth
              >
                {STATUS.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField name="images" label="Images" value={form.images} disabled fullWidth />
            <TextField name="inDate" label="InDate" type="date" value={form.inDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
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
            />
            <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} multiline rows={2} placeholder="Enter things to remember" fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}