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


  const [isSubmitting, setIsSubmitting] = useState(false);


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

    // AGE VALIDATION (60+)
    const calculatedAge = calcAge(form.birthday);
  if (calculatedAge < 60) {
    setErrors({ birthday: "You must be 60 years old or above to register." });

    showAlert({
      title: "Age Requirement",
      message: "You must be 60 years old or above to register.",
    });
    return;
  }

  setAge(calculatedAge); // store valid age
  setErrors({});
  setStep(3);
}

 

  // ---------------------------
  // STEP 3 VALIDATION (EMERGENCY CONTACT INFO) WITH HIGHLIGHT
  // ---------------------------
  async function handleStep3(e) {
    e.preventDefault();

    // remove sub to required fields
     setErrors((prev) => {
       const { subdivision, ...rest } = prev;
       return rest;
     });

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

    // limit phone number format validation 
    if (
      form.emergency_number.length !== 11 ||
      !form.emergency_number.startsWith("09")
    ) {
      setErrors({
        emergency_number: "Invalid phone number format",
      });

      showAlert({
        title: "Invalid Contact Number",
        message:
          "Emergency contact number must be 11 digits and start with 09.",
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

   if (isSubmitting) return; // prevent double submit
   setIsSubmitting(true);

   const fd = new FormData();

   // append files
   fd.append("id_picture", idPicture);
   fd.append("signature_picture", signaturePicture);

   // Account fields
   fd.append("email", email);
   fd.append("password", password);

   // Step 2 & 3 fields
   Object.keys(form).forEach((key) => {
     fd.append(key, form[key]);
   });

   fd.append("age", age);
   fd.append("city", "San Juan");
   fd.append("province", "Metro Manila");

   // front-end file check
 if (!idPicture || !signaturePicture) {
   const newErrors = {};

   if (!idPicture) newErrors.id_picture = "This field is required";
   if (!signaturePicture)
     newErrors.signature_picture = "This field is required";

   setErrors(newErrors); 
   setIsSubmitting(false); // allow retry

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

     if (data.success) {
        showAlert({
          title: "Registration Successful",
          message: "Your account has been registered successfully.",
          icon: "success",
        });
       navigate("/user-dashboard");
     } else {
       setErrors(data.errors || {});
       setIsSubmitting(false); 
     }
   } catch (err) {
     console.error(err);
     setIsSubmitting(false); 
   }
 }


  // ------------------------------------------------------
  // SWEET ALERT (POP-UP) ]if field is missing
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

  // Back button behavior (data persistence) at Uploads
  const [idPicture, setIdPicture] = useState(null);
  const [signaturePicture, setSignaturePicture] = useState(null);

  // Allow digits only
  const digitsOnly = (value) => value.replace(/\D/g, "");

  // Philippine mobile format (09XXXXXXXXX)
  const formatPHPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    // enforce starting 09
    if (digits.length > 0 && !digits.startsWith("09")) {
      digits = "09" + digits.replace(/^0+/, "").slice(0, 9);
    }

    return digits.slice(0, 11);
  };

  //Date of Birth format
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


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
            ),
          )}
        </div>

        {/* STEP 1 — ACCOUNT SETUP */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <h2 className="text-2xl font-bold">Create an Account</h2>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                className={inputClass("email")}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.email}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                className={inputClass("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-red-500 text-xs">{errors.password}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
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
                  <label className="block text-gray-700 font-medium capitalize">
                    {item.replace(/_/g, " ")}
                  </label>
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
              {/* HOUSE NUMBER (digits only) */}
              <div>
                <label className="block text-gray-700 font-medium">
                  House No. / Building / Lot No. *
                </label>
                <input
                  name="house"
                  value={form.house || ""}
                  className={inputClass("house")}
                  inputMode="numeric"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, house: digits });
                    setErrors({ ...errors, house: "" });
                  }}
                />
                <p className="text-red-500 text-xs">{errors.house}</p>
              </div>

              {/* STREET */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Street *
                </label>
                <input
                  name="street"
                  value={form.street || ""}
                  className={inputClass("street")}
                  onChange={(e) => {
                    setForm({ ...form, street: e.target.value });
                    setErrors({ ...errors, street: "" });
                  }}
                />
                <p className="text-red-500 text-xs">{errors.street}</p>
              </div>

              {/* SUBDIVISION */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Subdivision
                </label>
                <input
                  name="subdivision"
                  value={form.subdivision || ""}
                  className={inputClass("subdivision")}
                  onChange={(e) => {
                    setForm({ ...form, subdivision: e.target.value });
                    setErrors({ ...errors, subdivision: "" });
                  }}
                />
                <p className="text-red-500 text-xs">{errors.subdivision}</p>
              </div>

              {/* Barangay */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Barangay *
                </label>
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
                  <option>Addition Hills</option>
                  <option>Balong-Bato</option>
                  <option>Batis</option>
                  <option>Corazon De Jesus</option>
                  <option>Ermitaño</option>
                  <option>Halo-halo</option>
                  <option>Isabelita</option>
                  <option>Kabayanan</option>
                  <option>Little Baguio</option>
                  <option>Maytunas</option>
                  <option>Onse</option>
                  <option>Pasadeña</option>
                  <option>Pedro Cruz</option>
                  <option>Progreso</option>
                  <option>Rivera</option>
                  <option>Salapan</option>
                  <option>San Perfecto</option>
                  <option>Santa Lucia</option>
                  <option>Tibagan</option>
                  <option>West Crame</option>
                  <option>Greenhills</option>
                </select>
                <p className="text-red-500 text-xs">{errors.barangay}</p>
              </div>
            </div>

            {/* Birthday + Age + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Date of Birth *
                  </label>
                  <p className="text-xs text-gray-500 mb-1 md:hidden">
                    (Click the calendar and select your birth date)
                  </p>
                </div>

                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
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
                <label className="block text-gray-700 font-medium">Age</label>
                <input
                  disabled
                  value={age || ""}
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={form.gender || ""}
                  className={inputClass("gender")}
                  onChange={(e) => {
                    setForm({ ...form, gender: e.target.value });
                    setErrors({ ...errors, gender: "" });
                  }}
                >
                  <option value="">-- Select --</option>
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
                  <label className="block text-gray-700 font-medium">
                    {emergencyLabels[item]}
                  </label>
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
                <label className="block text-gray-700 font-medium">
                  Emergency Contact Number
                </label>
                <input
                  name="emergency_number"
                  inputMode="numeric"
                  placeholder="09XXXXXXXXX"
                  value={form.emergency_number || ""}
                  className={inputClass("emergency_number")}
                  onChange={(e) => {
                    const formatted = formatPHPhone(e.target.value);
                    setForm({ ...form, emergency_number: formatted });
                    setErrors({ ...errors, emergency_number: "" });
                  }}
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

            <div className="border border-gray-200 p-4 rounded shadow-md md:shadow-none">
              <div className="grid md:grid-cols-2 justify-center md:justify-evenly gap-4">
                {/* Passport ID Picture */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    1x1 / Passport Size Image
                  </label>
                  <div
                    className={`w-32 h-32 flex items-center justify-center text-gray-500 border p-2 rounded ${
                      errors.id_picture ? "border-red-500" : "border-gray-400"
                    }`}
                  >
                    {idPicture ? (
                      <img
                        src={URL.createObjectURL(idPicture)}
                        alt="ID Preview"
                        className="w-32 h-32 object-cover"
                      />
                    ) : (
                      "Preview"
                    )}
                  </div>
                  <p className="text-red-500 text-xs mb-2">
                    {errors.id_picture}
                  </p>

                  <button
                    type="button"
                    className="px-6 py-1 bg-blue-600 text-white rounded mt-2"
                    onClick={() =>
                      document.getElementById("id_picture_input").click()
                    }
                  >
                    Choose File
                  </button>
                  <input
                    type="file"
                    id="id_picture_input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (idPicture) URL.revokeObjectURL(idPicture); // clean previous preview
                      setIdPicture(e.target.files[0]);
                    }}
                  />
                </div>

                {/* Signature Picture */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Signature on white background 
                  </label>
                  <div
                    className={`w-100 h-32 flex items-center justify-center text-gray-500 border p-2 rounded ${
                      errors.signature_picture
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  >
                    {signaturePicture ? (
                      <img
                        src={URL.createObjectURL(signaturePicture)}
                        alt="Signature Preview"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      "Preview"
                    )}
                  </div>
                  <p className="text-red-500 text-xs mb-2">
                    {errors.signature_picture}
                  </p>

                  <button
                    type="button"
                    className="px-6 py-1 bg-blue-600 text-white rounded mt-2"
                    onClick={() =>
                      document.getElementById("signature_input").click()
                    }
                  >
                    Choose File
                  </button>
                  <input
                    type="file"
                    id="signature_input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (signaturePicture)
                        URL.revokeObjectURL(signaturePicture); // clean previous preview
                      setSignaturePicture(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setStep(3)}
              >
                Back
              </button>

              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
