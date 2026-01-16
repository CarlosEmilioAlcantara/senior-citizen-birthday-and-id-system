import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminsLogin() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch("/auth/admin-login", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      setErrors({ ...data.errors });
      setStatus(data.success);
      setResponse(data.response);

      if (data.status === 429) {
        navigate("/too-many-requests");
      }

      if (data.success && data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.success && data.role === "superadmin") {
        navigate("/superadmin-dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-8 border-white rounded-2xl">
        <h3 className="text-3xl font-bold text-white mb-4">Senior Citizen</h3>
        <p className="text-white text-sm max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex flex-col justify-center p-12 lg:p-20 ">
        {!status && <p className="text-red-500 text-center mb-4">{response}</p>}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Log in to your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Email o Username
            </label>
            <input
              type="text"
              name="email_or_username"
              placeholder="example@email.com"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <small className="text-xs text-red-500">
              {errors.email_or_username}
            </small>
          </div>

          <div>
            <div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Password"  
                  name="password"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-red-500">{errors.password}</p>
              <Link
                to="/admin-reset-password"
                className="text-xs text-red-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:scale-105 transition"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
