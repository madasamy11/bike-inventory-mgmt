import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/authContext";
import Login from "./pages/login";
import Inventory from "./pages/inventory";

function AppContent() {
  const { auth } = useContext(AuthContext);
  return auth ? <Inventory /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
