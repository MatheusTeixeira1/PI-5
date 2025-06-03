import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoading: true,
    isValid: false
  });

  useEffect(() => {
    const verifyToken = () => {
      const token = localStorage.getItem("authToken"); // Certifique-se que é a mesma chave usada no login
        
      if (!token) {
        setAuthStatus({ isLoading: false, isValid: false });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        
        setAuthStatus({
          isLoading: false,
          isValid: !isExpired
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("authToken");
        setAuthStatus({ isLoading: false, isValid: false });
      }
    };

    verifyToken();
  }, []);

  if (authStatus.isLoading) {
    return <div className="loading-spinner">Verificando autenticação...</div>;
  }

  return authStatus.isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;