// components/comum/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Instale com: npm install jwt-decode

const ProtectedRoute = () => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        setIsValid(!isExpired);
      } catch {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return <div>Carregando...</div>; // Ou um spinner
  }

  return isValid ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;