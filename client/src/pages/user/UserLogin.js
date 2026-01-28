import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function UserLogin() {
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
      // iconColor: "#2563eb",
      iconColor: "#d33",
      background: "#ffffff",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl px-6 py-4",
        confirmButton:
          "mt-4 bg-red-600 text-white px-6 py-2 rounded text-xl hover:bg-red-700",
      },
    });
  };

  // ---------------------------
  // LOGIN HANDLER
  // ---------------------------
  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const email = fd.get("email");
    const password = fd.get("password");

    //  EMPTY FIELDS
    if (!email || !password) {
      showAlert({
        title: "Missing Information",
        message: "Please enter both email and password.",
      });
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setErrors({ ...data.errors });

      //  TOO MANY REQUESTS
      if (data.status === 429) {
        navigate("/too-many-requests");
        return;
      }

      //  INVALID LOGIN
      if (!data.success) {
        showAlert({
          title: "Login Failed",
          message: data.response || "Invalid email or password.",
        });
        return;
      }

      //  SUCCESS
      if (res.ok && data.success) {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    // ---------------------------
    // BLUE LOGIN
    // ---------------------------
    // <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
    //   {/* LEFT SIDE */}
    //   <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 border-8 border-white rounded-2xl">
    //     <img src="logo192.png" />
    //     <h3 className="text-3xl font-bold text-white mb-4">Senior Citizen</h3>
    //     <p className="text-white text-sm max-w-md">
    //       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //     </p>
    //   </div>

    //   {/* RIGHT SIDE */}
    //   <div className="flex flex-col justify-center p-12 lg:p-20">
    //     <h2 className="text-3xl font-bold text-gray-800 mb-6">
    //       Log in to your Account
    //     </h2>

    //     <form onSubmit={handleLogin} className="space-y-4">
    //       <div>
    //         <label className="block text-gray-700 font-medium">Email</label>
    //         <input
    //           type="email"
    //           name="email"
    //           placeholder="example@email.com"
    //           className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //         <p className="text-xs text-red-500">{errors.email}</p>
    //       </div>

    //       <div>
    //         <label className="block text-gray-700 font-medium">Password</label>
    //         <input
    //           type="password"
    //           name="password"
    //           placeholder="Password"
    //           className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //         <div className="flex justify-between">
    //           <p className="text-xs text-red-500">{errors.password}</p>
    //           <Link
    //             to="/user-reset-password"
    //             className="text-xs text-red-600 hover:underline"
    //           >
    //             Forgot Password?
    //           </Link>
    //         </div>
    //       </div>

    //       <button
    //         type="submit"
    //         className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:scale-105 transition"
    //       >
    //         Login
    //       </button>
    //     </form>

    //     <div className="text-center my-6 text-sm text-gray-600">
    //       Don&apos;t have an account yet?{" "}
    //       <Link
    //         to="/user-register"
    //         className="text-blue-600 font-semibold hover:underline"
    //       >
    //         Create an Account
    //       </Link>
    //     </div>
    //   </div>
    // </div>

    // ---------------------------
    // RED LOGIN
    // ---------------------------
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-[#FF2424] to-[#8B1E2F] flex flex-col justify-center items-center text-center p-10 border-8 border-white rounded-2xl">
        <div className="flex md:flex-col items-center gap-3">
          {/* Avatar */}
          <div className="flex justify-center sm:justify-start">
            <div className="size-20 md:size-44 rounded-full bg-white flex items-center justify-center shadow-lg filter drop-shadow-[0_0_0.25rem_#242424]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-20 md:size-40 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* TEXT */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white md:mb-4">
              Senior Citizens
            </h3>

            <p className="text-white text-xs md:text-sm max-w-md">
              Senior Citizen's Birthday Cash Gift System
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-20">
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
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-red-500">{errors.email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-between">
              <p className="text-xs text-red-500">{errors.password}</p>
              <Link
                to="/user-reset-password"
                className="text-xs text-red-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full py-3 rounded bg-gradient-to-l from-[#FF2424] to-[#8B1E2F] text-white font-semibold hover:scale-105 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center my-6 text-sm text-gray-600">
          Don&apos;t have an account yet?{" "}
          <Link
            to="/user-register"
            className="text-[#FF2424] font-bold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
