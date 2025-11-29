import { useContext, useState } from "react";
import { AuthProvider, AuthContext } from "./context/authContext";
import Login from "./pages/login";
import Home from "./pages/home";
import BrandItems from "./pages/brandItems";

function AppContent() {
  const { auth } = useContext(AuthContext);
  const [selectedBrand, setSelectedBrand] = useState(null);

  if (!auth) {
    return <Login />;
  }

  if (selectedBrand) {
    return (
      <BrandItems 
        brandName={selectedBrand} 
        onBack={() => setSelectedBrand(null)} 
      />
    );
  }

  return <Home onBrandClick={(brandName) => setSelectedBrand(brandName)} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
