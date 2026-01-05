import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";

export default function UserDelete() {
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleDeleteAccount(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/user/delete-account", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      setErrors({ ...data.errors });

      if (data.status === 429) {
        navigate("/too-many-requests");
      }

      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }

      if (data.success) {
        navigate("/user-login");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // SideBar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-white md:h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex justify-between items-center p-4 filter drop-shadow-[0_0_0.25rem_#0097A7]">
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
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>

          {/* Profile Container */}
        </header>
        {/* SCROLLABLE  USER Delete Account CONTENT */}
        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {!status && <p style={{ color: "red" }}>{response}</p>}

          <form onSubmit={handleDeleteAccount}>
            <h3>User Delete Account</h3>
            <h3 style={{ color: "red" }}>
              Warning this will permanently delete your account
            </h3>
            <label>Password</label>
            <input type="password" placeholder="password" name="password" />
            <br />
            <small style={{ color: "red" }}>{errors.password}</small>
            <br />

            <label>Confirm by entering password again</label>
            <input type="password" placeholder="password" name="confirm" />
            <br />
            <small style={{ color: "red" }}>{errors.confirm}</small>
            <br />

            <div className="flex justify-between">
              <nav>
                <button className="px-4 py-2 bg-gray-300 rounded">
                  <Link to="/user-dashboard">Cancel</Link>
                </button>
              </nav>
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded"
                type="submit"
              >
                Delete Account
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}