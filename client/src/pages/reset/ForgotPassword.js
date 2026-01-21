import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword({ accountType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOTP] = useState("");
  const [open, setOpen] = useState(null);
  const [status, setStatus] = useState(true);
  const [timeCheck, setTimeCheck] = useState(true);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const [sendingOTP, setSendingOTP] = useState(false);
  const RESEND_TIME = 30 * 60; // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(0);



  const navigate = useNavigate();

 
  const loginRoute = accountType === "admin" ? "/admins-login" : "/user-login";

  async function handleResetPassword(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    try {
      setSendingOTP(true); // start animation

      const res = await fetch("/auth/reset-password", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setResponse(data.response);
      setErrors({ ...data.errors });

      if (data.status === 429) {
        navigate("/too-many-requests");
      }

      if (res.ok && data.success) {
        setOpen(true);
        startResendTimer(); // start 30 min timer here
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingOTP(false); // stop animation
    }
  }

  function startResendTimer() {
    const expiry = Date.now() + RESEND_TIME * 1000;
    localStorage.setItem("otp_expiry", expiry);
    setTimeLeft(RESEND_TIME);
  }

  

  async function handleOTP(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("role", accountType);

    try {
      const res = await fetch("/auth/otp", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);
      setErrors({ ...data.errors });

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (res.ok && data.success) {
        alert(`${data.response}, redirecting you back to login page`);
        navigate(loginRoute); 
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirm }),
      });
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (res.ok && data.success) {
        alert(`New OTP sent`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const storedExpiry = localStorage.getItem("otp_expiry");

    if (storedExpiry) {
      const remaining = Math.floor((storedExpiry - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      }
    }

    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 border-4 border-white rounded-2xl">
        <h3 className="text-3xl font-bold text-white mb-4">Senior Citizen</h3>
        <p className="text-white text-sm max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* RIGHT SIDE */}
      {open ? (
        <div className="flex flex-col justify-center p-12 lg:p-20">
          <h2 className="text-3xl font-bold text-gray-800 ">Confirm OTP</h2>
          <div className="text-gray-500 font-medium px-2 mb-4">
            Please check your email for an OTP that is being sent for password
            reset verification.
          </div>
          {!status && <p className="text-red-500">{response}</p>}

          <form onSubmit={handleOTP} className="space-y-4">
            <input
              type="text"
              name="otp"
              value={otp}
              className="w-full border p-2 rounded"
              onKeyDown={(e) => {
                if (
                  (e.key >= "0" && e.key <= "9") ||
                  e.key === "Backspace" ||
                  e.key === "Delete"
                ) {
                  if (e.key === "Backspace" || e.key === "Delete") {
                    setOTP((o) => o.slice(0, -1));
                  } else {
                    setOTP((o) => o + e.key);
                  }
                }
              }}
            />
            <p className="text-red-500">{errors.otp}</p>

            <button className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer">
              Confirm Reset
            </button>
          </form>

          {/* <button onClick={resendOTP} disabled={timeCheck}>
            Resend OTP
          </button> */}
          <button
            onClick={resendOTP}
            disabled={timeLeft > 0}
            className={`mt-4 text-sm font-medium
    ${
      timeLeft > 0
        ? "text-gray-400 cursor-not-allowed"
        : "text-blue-600 hover:underline"
    }`}
          >
            {timeLeft > 0
              ? `Resend OTP in ${formatTime(timeLeft)}`
              : "Resend OTP"}
          </button>

          <div className="text-center mt-6">
            <Link
              to={loginRoute}
              className="hover:underline text-blue-600 font-semibold"
            >
              Go back to Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold mb-6">Forgot Password</h2>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-gray-500 font-medium px-2">
              Please provide your registered email address and set a new
              password. An OTP will be sent for password reset verification.
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                name="email"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.email}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p className="text-red-500 text-xs">{errors.password}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <p className="text-red-500 text-sm">{errors.confirm}</p>
            </div>

            {/* <button
              className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              type="submit"
            >
              Send OTP
            </button> */}
            <button
              type="submit"
              disabled={sendingOTP}
              className={`mt-8 w-full py-3 rounded text-white font-semibold transition-all duration-300
    ${
      sendingOTP
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-cyan-700 to-blue-700 hover:scale-105"
    }`}
            >
              {sendingOTP ? (
                <span className="flex justify-center items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>

            <div className="text-center mt-6">
              <Link
                to={loginRoute}
                className="text-blue-600 font-semibold hover:underline"
              >
                Go back to Login
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
