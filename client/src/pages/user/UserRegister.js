import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function UserRegister() {
  // ---------------------------
  // FORM STATES
  // ---------------------------
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [birthday, setBirthday] = useState("1950-01-01");
  const [age, setAge] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    house: "",
    street: "",
    subdivision: "",
    barangay: "",
    gender: "",
    emergency_fname: "",
    emergency_mname: "",
    emergency_lname: "",
    emergency_number: "",
    birthday: "",
  });

  // ---------------------------
  // LABEL FOR EMERGENCY CONTACT
  // ---------------------------
  const emergencyLabels = {
    emergency_fname: "Emergency Contact First Name",
    emergency_mname: "Emergency Contact Middle Name",
    emergency_lname: "Emergency Contact Last Name",
  };

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ---------------------------
  // HELPERS
  // ---------------------------
  const getMissingFields = (required, source) =>
    required.filter((field) => !source[field]);

  const inputClass = (field) =>
    `w-full border p-2 rounded ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  // ---------------------------
  // AGE CALCULATION
  // ---------------------------
  function calcAge(dateString) {
    const today = new Date();
    const dob = new Date(dateString);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  // ---------------------------
  // STEP 1 VALIDATION (ACC CREATION)
  // ---------------------------
  async function handleStep1(e) {
    e.preventDefault();

    const required = ["email", "password", "confirm"];
    const source = { email, password, confirm };

    const missing = getMissingFields(required, source);

    if (missing.length) {
      const newErrors = {};
      missing.forEach((f) => (newErrors[f] = "This field is required"));
      setErrors(newErrors);

      showAlert({
        title: "Missing Information",
        message: "Please complete the highlighted fields to continue.",
      });
      return;
    }

    setErrors({});
    setStep(2);
  }

  // ---------------------------
  // STEP 2 VALIDATION (PERSONAL INFO) WITH HIGHLIGHT
  // ---------------------------
  function handleStep2(e) {
    e.preventDefault();

    const required = [
      "first_name",
      "middle_name",
      "last_name",
      "house",
      "street",
      "subdivision",
      "barangay",
      "birthday",
      "gender",
    ];

    const missing = getMissingFields(required, form);

    if (missing.length) {
      const newErrors = {};
      missing.forEach((f) => (newErrors[f] = "This field is required"));
      setErrors(newErrors);

      showAlert({
        title: "Missing Information",
        message: "Please complete the highlighted fields to continue.",
      });
      return;
    }

    setErrors({});
    setStep(3);
  }

  // ---------------------------
  // STEP 3 VALIDATION (EMERGENCY CONTACT INFO) WITH HIGHLIGHT
  // ---------------------------
  async function handleStep3(e) {
    e.preventDefault();

    const required = [
      "emergency_fname",
      "emergency_mname",
      "emergency_lname",
      "emergency_number",
    ];

    const missing = getMissingFields(required, form);

    if (missing.length) {
      const newErrors = {};
      missing.forEach((f) => (newErrors[f] = "This field is required"));
      setErrors(newErrors);

      showAlert({
        title: "Missing Information",
        message: "Please complete the highlighted fields to continue.",
      });
      return;
    }

    setErrors({});
    setStep(4);
  }

  // ---------------------------
  // FINAL SUBMISSION
  // ---------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.target);
    const id_picture = e.target.id_picture.files[0];
    const signature_picture = e.target.signature_picture.files[0];

    // Account fields
    fd.append("email", email);
    fd.append("password", password);

    // Add all Step 2 + Step 3 fields
    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    fd.append("age", age);
    fd.append("city", "San Juan");
    fd.append("province", "Metro Manila");

    // check empty fields
    if (!id_picture || !signature_picture) {
      const newErrors = {};
      if (!id_picture) newErrors.id_picture = "This field is required";
      if (!signature_picture)
        newErrors.signature_picture = "This field is required";

      setErrors(newErrors);

      showAlert({
        title: "Missing Information",
        message: "Please upload all required documents.",
      });
      return;
    }

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      setErrors({ ...data.errors });

      if (data.success) navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  // Please fill out all fields to complete the registration
  // ------------------------------------------------------
  // SWEET ALERT (POP-UP) FOR STEP 1 ACCOUNT CREATION
  // ------------------------------------------------------
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

  //for Back button behavior (data persistence)
  const [idPicture, setIdPicture] = useState(null);
  const [signaturePicture, setSignaturePicture] = useState(null);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT SIDE */}
      <div className="bg-gradient-to-b from-cyan-700 to-blue-700 flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-8 border-white rounded-2xl">
        <h3 className="text-3xl font-bold text-white mb-4">Senior Citizen</h3>
        <p className="text-white text-sm max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="w-full  bg-white shadow-xl rounded-xl p-8">
        {/* PROGRESS INDICATOR */}
        <div className="flex justify-between mb-5">
          {["Account", "Personal Info", "Contact Info", "Uploads"].map(
            (label, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  onClick={() => {
                    // Clickable PROGRESS INDICATOR Only allow jumping to completed steps
                    if (step > index + 1) setStep(index + 1);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white
                  ${
                    step === index + 1
                      ? "bg-blue-600"
                      : step > index + 1
                      ? "bg-blue-700"
                      : "bg-gray-400"
                  }`}
                  >
                    {step > index + 1 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>

                <p
                  className={`mt-2 font-medium text-xs md:text-sm ${
                    step === index + 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        {/* STEP 1 — ACCOUNT SETUP */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <h2 className="text-2xl font-bold">Create an Account</h2>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                className={inputClass("email")}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.email}</p>
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                className={inputClass("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.password}</p>
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                className={inputClass("confirm")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.confirm}</p>
            </div>

            <button className="w-full py-3 bg-blue-700 text-white rounded-lg">
              Continue
            </button>

            <div className="text-center my-6">
              <span className="text-sm text-gray-600 flex justify-center gap-1">
                <span>Already have an account?</span>
                <Link
                  to="/user-login"
                  className="hover:underline text-blue-600 font-semibold"
                >
                  Login here
                </Link>
              </span>
            </div>
          </form>
        )}

        {/* STEP 2 — PERSONAL INFO */}
        {step === 2 && (
          <form className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["first_name", "middle_name", "last_name"].map((item) => (
                <div key={item}>
                  <label>{item.replace("_", " ").toUpperCase()}</label>
                  <input
                    name={item}
                    value={form[item] || ""}
                    className={inputClass(item)}
                    onChange={(e) => {
                      setForm({ ...form, [item]: e.target.value });
                      setErrors({ ...errors, [item]: "" });
                    }}
                  />

                  <p className="text-red-500 text-xs">{errors[item]}</p>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["house", "street", "subdivision"].map((item) => (
                <div key={item}>
                  <label>{item.toUpperCase()}</label>
                  <input
                    name={item}
                    value={form[item] || ""}
                    className={inputClass(item)}
                    onChange={(e) => {
                      setForm({ ...form, [item]: e.target.value });
                      setErrors({ ...errors, [item]: "" });
                    }}
                  />

                  <p className="text-red-500 text-xs">{errors[item]}</p>
                </div>
              ))}

              {/* Barangay */}
              <div>
                <label>Barangay</label>
                <select
                  name="barangay"
                  value={form.barangay || ""}
                  className={inputClass("barangay")}
                  onChange={(e) => {
                    setForm({ ...form, barangay: e.target.value });
                    setErrors({ ...errors, barangay: "" });
                  }}
                >
                  <option value="">-- Select --</option>
                  <option value="Greenhills">Greenhills</option>
                  <option value="Maytunas">Maytunas</option>
                  <option value="Kabayanan">Kabayanan</option>
                  <option value="Salapan">Salapan</option>
                  <option value="West Crame">West Crame</option>
                  <option value="Onse">Onse</option>
                </select>
                <p className="text-red-500 text-xs">{errors.barangay}</p>
              </div>
            </div>

            {/* Birthday + Age + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthday"
                  value={birthday}
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    setAge(calcAge(e.target.value));
                    setForm({ ...form, birthday: e.target.value });
                  }}
                />
                <p className="text-red-500 text-xs">{errors.birthday}</p>
              </div>

              <div>
                <label>Age</label>
                <input
                  disabled
                  value={age || ""}
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={form.gender || ""}
                  className={inputClass("gender")}
                  onChange={(e) => {
                    setForm({ ...form, gender: e.target.value });
                    setErrors({ ...errors, gender: "" });
                  }}
                >
                  <option>-- Select --</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <p className="text-red-500 text-xs">{errors.gender}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-700 text-white rounded"
                onClick={handleStep2}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 — CONTACT INFO */}
        {step === 3 && (
          <form className="space-y-4">
            <h2 className="text-2xl font-bold">Emergency Contact</h2>

            <div className="grid grid-cols-1 gap-4">
              {Object.keys(emergencyLabels).map((item) => (
                <div key={item}>
                  <label>{emergencyLabels[item]}</label>
                  <input
                    name={item}
                    value={form[item] || ""}
                    className={inputClass(item)}
                    onChange={(e) => {
                      setForm({ ...form, [item]: e.target.value });
                      setErrors({ ...errors, [item]: "" });
                    }}
                  />
                  <p className="text-red-500 text-xs">{errors[item]}</p>
                </div>
              ))}

              <div>
                <label>Emergency Contact Number</label>
                <input
                  name="emergency_number"
                  value={form.emergency_number || ""}
                  maxLength={13}
                  className={inputClass("emergency_number")}
                  onChange={(e) =>
                    setForm({ ...form, emergency_number: e.target.value })
                  }
                />
                <p className="text-red-500 text-xs">
                  {errors.emergency_number}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-700 text-white rounded"
                onClick={handleStep3}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 4 — UPLOADS */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold">Upload Required Documents</h2>

            <div>
              <label>1x1 / Passport Image</label>
              <input
                type="file"
                name="id_picture"
                className={`w-full border p-2 rounded ${
                  errors.id_picture ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => setIdPicture(e.target.files[0])}
              />
              <p className="text-red-500 text-xs">{errors.id_picture}</p>
            </div>

            <div>
              <label>Signature (White BG)</label>
              <input
                type="file"
                name="signature_picture"
                className={`w-full border p-2 rounded ${
                  errors.signature_picture
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                onChange={(e) => setSignaturePicture(e.target.files[0])}
              />
              <p className="text-red-500 text-xs">{errors.signature_picture}</p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setStep(3)}
              >
                Back
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
