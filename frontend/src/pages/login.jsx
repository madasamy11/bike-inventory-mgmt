import { useState, useContext, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "../context/authContext";
import { 
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Stack,
  useTheme,
  Fade,
} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

const BRANDS = ["Yamaha", "Honda", "Hero", "Royal Enfield", "Suzuki"];

export default function Login() {
  const theme = useTheme();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentBrand, setCurrentBrand] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBrand((prev) => (prev + 1) % BRANDS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      login(data.token, data.role, data.name);
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000d65ff 0%, #46608eff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={24}
          sx={{ 
            overflow: 'hidden',
            display: 'flex',
            minHeight: 780,
            borderRadius: 5
          }}
        >
          {/* Left Side - Brand Display */}
          <Box 
            sx={{ 
              width: '60%',
              p: 6,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: '#1e3c72',
              position: 'relative'
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <TwoWheelerIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
              <Typography 
                variant="h5"
                sx={{ 
                  color: 'white',
                  opacity: 0.9,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 4,
                  animation: 'fadeIn 2s infinite'
                }}
              >
                {BRANDS[currentBrand]}
              </Typography>
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: '50%' },
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, // reduced gap from 3 to 2
                width: '100%',
                maxWidth: 400,
                mx: 'auto'
              }}
            >
              {/* Centered Logo above Typography */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1.5 }}> {/* reduced mb */}
                <img src="/wheelsfy-logo.png" alt="Logo" style={{ height: 32, width: 32 }} />
                <Typography variant="h4" 
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1e3c72',
                    mb: 2 // reduced mb from 4 to 2
                  }}>
                  Wheelsfy
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 200,
                  color: '#1e3c72',
                  mb: 2 // reduced mb from 4 to 2
                }}
                >
                Login to Your Account
                </Typography>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ 
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: 2
                  }
                  }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ 
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: 2
                  }
                  }}
                  InputProps={{
                  endAdornment: (
                    <Button
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    sx={{ minWidth: 0, px: 1 }}
                    >
                    {showPassword ? "🙈" : "👁️"}
                    </Button>
                  )
                  }}
                />
                {error && (
                  <Typography color="error" fontSize={14} textAlign="center" sx={{ mt: -1, mb: 1 }}>
                  {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                  py: 1.2, // slightly reduced padding
                  bgcolor: '#1e3c72',
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#2a5298'
                  }
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
