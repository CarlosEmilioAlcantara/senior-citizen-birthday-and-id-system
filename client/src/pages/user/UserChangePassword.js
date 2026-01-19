import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
// import Sidebar from "../../components/Sidebar";

export default function UserChangePassword() {
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleChangePassword(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/user/change-password", {
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
        alert(data.response);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // SideBar
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    // <div className="flex bg-white md:h-screen">
    //   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    // </div>

    <div className="flex-1 overflow-y-auto  ">
      {!status && <p style={{ color: "red" }}>{response}</p>}

      <form
        onSubmit={handleChangePassword}
        className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-5 mt-5"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Change Password
        </h3>
        <div>
          <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
            <label className="text-gray-500 text-base">Old Password</label>
            <input
              className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
              type="password"
              name="old_password"
            />
          </div>

          <small className="text-red-500">{errors.old_password}</small>
        </div>

        <div>
          <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
            <label className="text-gray-500 text-base">New Password</label>
            <input
              className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
              type="password"
              name="password"
            />
          </div>

          <small className="text-red-500">{errors.password}</small>
        </div>

        <div>
          <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
            <label className="text-gray-500 text-base">
              Confirm New Password
            </label>
            <input
              className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
              type="password"
              name="confirm"
            />
          </div>

          <small className="text-red-500">{errors.confirm}</small>
        </div>

        <div className="flex justify-between">
          <nav>
            <button className="px-4 py-2 bg-gray-300 rounded">
              <Link to="/user-dashboard">Cancel</Link>
            </button>
          </nav>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}