import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    async function getRole() {
      await fetch("/auth/get-role", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
        })
    }

    getRole();
  }, []);

  return (
    <div className="bg-gradient-to-b from-cyan-700 to-blue-700">
      <nav className="mx-3 w-64 hidden md:block">
        <li className="flex flex-col ">
          {role === "user" && (
            <>
              {/* <Link to="/">Home</Link> */}
              {/* <a>Pending Awards</a>
              <a>Received Awards</a> */}
              <Link to="/user-edit">Edit Account</Link>
              <Link to="/user-change-password">Change Password</Link>
              <Link to="/user-delete">Delete Account</Link>
              <Link to="/logout">Logout</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin-dashboard">Dashboard</Link>
              <Link to="/users-list">List of Users</Link>
              <Link to="/admins-edit">Edit Account</Link>
              <Link to="/admins-delete">Delete Account</Link>
              <Link to="/logout">Logout</Link>
            </>
          )}

          {role === "superadmin" && (
            <>
              <Link to="/superadmin-dashboard">Dashboard</Link>
              <Link to="/users-list">List of Users</Link>
              <Link to="/superadmin-create-admins">Create Admins</Link>
              <Link to="/admins-list">List of Admins</Link>
              <Link to="/admins-edit">Edit Account</Link>
              <Link to="/admins-delete">Delete Account</Link>
              <Link to="/logout">Logout</Link>
            </>
          )}
        </li>
      </nav>
    </div>
  );
}