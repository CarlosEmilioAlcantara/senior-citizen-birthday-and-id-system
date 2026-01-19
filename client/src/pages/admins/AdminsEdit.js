import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";

export default function AdminsEdit() {
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  // --------------------------
  // State
  // --------------------------
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [info, setInfo] = useState({});
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function getAdminInfo() {
    try {
      const res = await fetch("/admins/info", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setInfo({ ...data.info });

      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getRole() {
    try {
      const res = await fetch("/auth/get-role", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setEmail(info.email);
    setUsername(info.username);
  }, [info]);

  useEffect(() => {
    getRole();
    getAdminInfo();
  }, []);

  async function handleAdminEdit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/admins/edit", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      setErrors({ ...data.errors });

      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.success) {
        navigate("/superadmin-dashboard");
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex items-center p-4 drop-shadow-[0_0_0.25rem_#0097A7]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer p-2 hover:text-cyan-700 hover:scale-110 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-bold">Edit Account</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {!status && <p style={{ color: "red" }}>{response}</p>}

          {/* <h3>Superadmin Edit Account</h3> */}
          <form onSubmit={handleAdminEdit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="email@email.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.email}</small>
            <br />

            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.username}</small>
            <br />

            <label>Password</label>
            <input type="password" placeholder="password" name="password" />
            <br />
            <small>Leave empty to not change</small>
            <small style={{ color: "red" }}>{errors.password}</small>
            <br />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="confirm password"
              name="confirm"
            />
            <br />
            <small style={{ color: "red" }}>{errors.confirm}</small>
            <br />

            <button type="submit">Edit Account</button>
          </form>

          {role === "admin" && (
            <button>
              <Link to="/admin-dashboard">Cancel</Link>
            </button>
          )}
          {role === "superadmin" && (
            <button>
              <Link to="/superadmin-dashboard">Cancel</Link>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}