import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(null);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  async function handleResetPassword(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        body: fd,
      })
      const data = await res.json();
      setResponse(data.response);
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (res.ok && data.success) {
        setOpen(data.success);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleOTP(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("email", email);
    fd.append("password", password)

    try {
      const res = await fetch("/auth/otp", {
        method: "POST",
        body: fd,
      })
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (res.ok && data.success) {
        alert(`${data.response}, redirecting you back to login page`);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function resendOTP(e) {
    e.preventDefault();

    try {
      const res = await fetch("/auth/resend-otp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password, confirm})
      })
      const data = await res.json();
      
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-4 border-white rounded-2xl">
        <h3 className="text-3xl font-bold text-white mb-4">
          Senior Citizen
        </h3>
        <p className="text-white text-sm max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      { open ? (
        <div className="flex flex-col justify-center  p-12 lg:p-20 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Confirm OTP
          </h2>

          {!status && <p style={{ color: "red" }}>{response}</p>}

          <form onSubmit={handleOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">
                OTP
              </label>
              <input
                type="number"
                placeholder="508795"
                name="otp"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-red-500">{errors.otp}</p>

            <button
              className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              type="submit"
            >
              Confirm Reset
            </button>
          </form>

          <div className="text-center my-6">
            <span className="text-sm text-gray-600 cursor-pointer flex justify-center gap-1">
              <span>Remembered your password?</span>
              <Link
                to="/user-login"
                className="hover:underline text-blue-600 font-semibold"
              >
                Login here
              </Link>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center  p-12 lg:p-20 ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Forgot Password
          </h2>

          {!status && <p style={{ color: "red" }}>{response}</p>}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                name="email"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-red-500">{errors.email}</p>

            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* <p className="text-xs text-gray-500 text-right">Must be 8 or more and no whitespace</p> */}

              <p className="text-red-500">{errors.password}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <p className="text-red-500">{errors.confirm}</p>
            </div>

            <button
              className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              type="submit"
            >
              Reset Password
            </button>
          </form>

          <div className="text-center my-6">
            <span className="text-sm text-gray-600 cursor-pointer flex justify-center gap-1">
              <span>Remembered your password?</span>
              <Link
                to="/user-login"
                className="hover:underline text-blue-600 font-semibold"
              >
                Login here
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}