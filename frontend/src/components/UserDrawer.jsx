import { Drawer } from "@/components/ui/drawer";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function UserDrawer({ open, setOpen }) {
  const { logout, auth } = useContext(AuthContext);
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box width={280} p={4} display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {auth?.user?.name ? auth.user.name[0] : "U"}
          </Avatar>
          <Typography fontWeight={700} fontSize={20}>{auth?.user?.name || "User"}</Typography>
          <Typography fontSize={14} color="text.secondary">{auth?.user?.email}</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <Button variant="contained" color="primary">Profile</Button>
          <Button variant="outlined" color="inherit" onClick={() => { logout(); setOpen(false); }}>
            <LogOut className="w-5 h-5 text-red-600" />
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
