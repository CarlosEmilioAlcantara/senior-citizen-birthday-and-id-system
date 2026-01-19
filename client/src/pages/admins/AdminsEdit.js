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
          <form
            onSubmit={handleAdminEdit}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start">
                <div className="size-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-32 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">
                  Admin Account
                </h2>
                <p className="text-sm text-gray-500">
                  Update login credentials and security
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <small className="text-red-500">{errors.username}</small>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <small className="text-red-500">{errors.email}</small>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
              <h3 className="text-lg font-semibold text-red-600 mb-1">
                Change Password
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Leave blank if you don’t want to change password
              </p>

              <div className="space-y-4">
                {/* ADDED OLD PASS FROM UserChangePassword */}
                <div>
                  <label className="text-sm text-gray-600">Old Password</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="old_password"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">New Password</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="password"
                  />
                  <small className="text-red-500">{errors.password}</small>
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Confirm Password
                  </label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="confirm"
                  />
                  <small className="text-red-500">{errors.confirm}</small>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                {role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </Link>
                )}
                {role === "superadmin" && (
                  <Link
                    to="/superadmin-dashboard"
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </Link>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}