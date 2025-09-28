import { useState, useContext } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { AuthContext } from "../context/authContext";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const { auth, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initials = auth?.user
    ? auth.user.split(" ").map(n => n[0]).join("")
    : "U";

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            component="img" 
            src="/wheelsfy-logo.png" 
            alt="Logo" 
            sx={{ 
              height: 40, 
              width: 40,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 1 
            }}
          >
            Wheelsfy
          </Typography>
        </Box>
        {auth && (
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              border: '2px solid',
              borderColor: 'primary.main',
              p: 0.5,
              '&:hover': {
                bgcolor: 'primary.soft',
              }
            }}
          >
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600
            }}>
              {initials}
            </Avatar>
          </IconButton>
        )}
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {auth?.user || "User"} - {auth?.role || "Role"}
          </Typography>
          <IconButton color="error" onClick={() => { logout(); setDrawerOpen(false); }}>
            <LogoutIcon />
            <Typography sx={{ ml: 1 }}>Logout</Typography>
          </IconButton>
        </Box>
      </Drawer>
    </AppBar>
  );
}
