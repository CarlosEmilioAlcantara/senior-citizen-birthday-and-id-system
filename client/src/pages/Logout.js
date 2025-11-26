import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      try {
        const res = await fetch("/auth/logout", {
          method: "GET"
        })
        const data = await res.json();
        if (data.success && data.role === "user") {
          navigate("/user-login");
        } else if (
          data.success && 
          data.role === "admin" ||
          data.role === "superadmin"
        ) {
          navigate("/admins-login");
        }
      } catch (err) {
        console.error(err);
      }
    }

    handleLogout();
  }, [])

  return null;
}