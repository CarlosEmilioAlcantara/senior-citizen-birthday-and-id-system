import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminsLogin() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ---------------------------
  // SWEET ALERT (POP-UP)
  // ---------------------------
  const showAlert = ({ title, message, icon = "error" }) => {
    Swal.fire({
      title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
      html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
      icon,
      iconColor: "#2563eb",
      background: "#ffffff",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl px-6 py-4",
        confirmButton:
          "mt-4 bg-blue-600 text-white px-6 py-2 rounded text-xl hover:bg-blue-700",
      },
    });
  };

  // ---------------------------
  // LOGIN HANDLER
  // ---------------------------
 async function handleLogin(e) {
   e.preventDefault();
   const fd = new FormData(e.target);

   const email = fd.get("email_or_username");
   const password = fd.get("password");

   if (!email || !password) {
     showAlert({
       title: "Missing Information",
       message: "Please enter both email and password.",
     });
     return;
   }

   try {
     const res = await fetch("/auth/admin-login", {
       method: "POST",
       credentials: "include",
       body: fd,
     });

     const data = await res.json();

     // TOO MANY REQUESTS
     if (res.status === 429) {
       navigate("/too-many-requests");
       return;
     }

     // FAILED
     if (!res.ok || data.success !== true) {
       showAlert({
         title: "Login Failed",
         message: data.response || "Invalid email or password.",
       });
       return;
     }

     //SUCCESS
     if (data.role === "admin") {
       navigate("/admin-dashboard");
     } else if (data.role === "superadmin") {
       navigate("/superadmin-dashboard");
     }
   } catch (err) {
     console.error(err);
     showAlert({
       title: "Server Error",
       message: "Something went wrong. Please try again later.",
     });
   }
 }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-8 border-white rounded-2xl">
        <img src="logo192.png" />
        <h3 className="text-3xl font-bold text-white mb-4">Senior Citizen</h3>
        <p className="text-white text-sm max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex flex-col justify-center p-12 lg:p-20 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Log in to your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Email or Username
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
