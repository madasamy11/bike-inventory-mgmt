import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const SESSION_EXPIRED_MESSAGE = "User session expired. Please login again";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState("");

   useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (token && user && role) {
      setAuth({
        token,
        user: JSON.parse(user),
        role: JSON.parse(role),
      });
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setAuth(null);
      setSessionExpiredMessage(SESSION_EXPIRED_MESSAGE);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const login = (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", JSON.stringify(role));
    setAuth({ token, role, user });
    setSessionExpiredMessage("");
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setAuth(null);
    setSessionExpiredMessage("");
  };

  const clearSessionExpiredMessage = () => {
    setSessionExpiredMessage("");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, sessionExpiredMessage, clearSessionExpiredMessage }}>
      {children}
    </AuthContext.Provider>
  );
};