import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function SuperadminCreateAdmins() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleCreateAdmin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);
    try {
      const res = await fetch("/superadmin/create-admin", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json();
      setErrors({...data.errors});

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
      if (data.status === 403) {
        navigate("/forbidden");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {/* { !status && (
        <p style={{color: "red"}}>{response}</p>
      )} */}

      {/* <h3>Superadmin Create Admins</h3> */}
      <form
        className="max-w-4xl mx-auto space-y-6"
        onSubmit={handleCreateAdmin}
      >
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          Creation of Admin and Superadmin Accounts
        </h3>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="email"
            name="email"
          />

          <small className="text-red-500">{errors.email}</small>
        </div>

        <div>
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            className="mt-1 w-full border rounded px-3 py-2"
            name="username"
          />

          <small className="text-red-500">{errors.username}</small>
        </div>

        <div>
          <label className="text-sm text-gray-600">Role</label>
          <select className="mt-1 w-full border rounded px-3 py-2" name="role">
            <option value="">-- Please select a role --</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <small className="text-red-500">{errors.role}</small>
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            name="password"
          />

          <small className="text-red-500">{errors.password}</small>
        </div>

        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            name="confirm"
          />

          <small className="text-red-500">{errors.confirm}</small>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Link
            to="/superadmin-dashboard"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium"
          >
            Create Admin
          </button>
        </div>
      </form>
    </div>
  );
}