import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    try {
      const res = await fetch("/login", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setErrors({ ...data.errors });
      setStatus(data.success);
      setResponse(data.response);

      if (data.status === 429) {
        navigate("/too-many-requests");
      }

      if (res.ok && data.success) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-4 border-white rounded-2xl">
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
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500">{errors.email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right">
              <span className="text-xs hover:underline text-red-600 cursor-pointer">
                <Link>Forgot Password?</Link>
              </span>
            </div>
            <small className="text-sm underline text-red-600 cursor-pointer">
              {errors.password}
            </small>
          </div>

          {/* Forgot Password Link */}
          {/* <div className="text-right mt-2">
            <span className="text-sm underline text-red-600 cursor-pointer">
              <Link>Forgot Password?</Link>
            </span>
          </div> */}

          <button
            type="submit"
            className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="text-center my-6">
          <span className="text-sm text-gray-600 cursor-pointer flex justify-center gap-1">
            <span>Don't have an account yet?</span>
            <Link
              to="/user-register"
              className="hover:underline text-blue-600 font-semibold"
            >
              Create an Account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
