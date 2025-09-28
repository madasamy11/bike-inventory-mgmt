import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      py: 2,
      px: 3,
      bgcolor: 'grey.100',
      borderTop: 1,
      borderColor: 'grey.300',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.95rem',
      color: 'grey.600',
      gap: 2
    }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Wheelsfy Bike Consultancy. All rights reserved.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: { xs: 1, md: 0 } }}>
        <Link href="https://github.com/" target="_blank" rel="noopener" underline="hover">Instagram</Link>
        <Link href="https://www.linkedin.com/" target="_blank" rel="noopener" underline="hover">Whatsapp</Link>
      </Box>
    </Box>
  );
}
