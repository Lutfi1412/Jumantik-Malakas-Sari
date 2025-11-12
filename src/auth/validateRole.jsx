import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkToken } from "../services/user";
import LoadingOverlay from "../components/LoadingOverlay";

export function RequireRole({ allowedRoles, children }) {
  const [loading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await checkToken(token);
        setRole(res.message);
      } catch (error) {
        console.error("Gagal verifikasi token:", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) return <LoadingOverlay show={loading} />;

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/404" replace />;

  return children || <Outlet />;
}
