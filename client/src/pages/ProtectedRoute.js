import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ allowedRoles }) {
  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/check-session", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setAuth(false);
          return;
        }

        const data = await res.json();
        setAuth(data.success);
        setRole(data.role);
      } catch {
        setAuth(false);
      }
    }

    checkSession();
  }, []);

  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/user-login" replace />;

  const roleAccess = {
    user: ["/user-dashboard"],
    admin: ["/admin-dashboard"],
    superadmin: ["/superadmin-dashboard", "/admin-dashboard"],
  };

  if (!allowedRoles.includes(role)) {
    const redirectPath = roleAccess[role]?.[0] || "/user-dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
