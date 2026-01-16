import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";
import ChangePass from "../../pages/user/UserChangePassword"

export default function UserEdit() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await fetch("/user/info", {
          method: "GET",
        });

        const data = await res.json();
        setInfo({ ...data.info });

        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getUserInfo();
  }, []);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [emergencyFirstName, setEmergencyFirstName] = useState("");
  const [emergencyMiddleName, setEmergencyMiddleName] = useState("");
  const [emergencyLastName, setEmergencyLastName] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");

  useEffect(() => {
    setEmail(info.email ?? "");
    setFirstName(info.first_name ?? "");
    setMiddleName(info.middle_name ?? "");
    setLastName(info.last_name ?? "");
    setHouse(info.house ?? "");
    setStreet(info.street ?? "");
    setSubdivision(info.subdivision ?? "");
    setBarangay(info.barangay ?? "");
    setCity(info.city ?? "");
    setProvince(info.province ?? "");
    setBirthday(info.birthday ?? "");
    setAge(info.age ?? "");
    setGender(info.gender ?? "");
    setEmergencyFirstName(info.emergency_fname ?? "");
    setEmergencyMiddleName(info.emergency_mname ?? "");
    setEmergencyLastName(info.emergency_lname ?? "");
    setEmergencyNumber(info.emergency_number ?? "");
  }, [info]);

  function handleSetAge() {
    const date = new Date();
    const yearNow = date.getFullYear();
    const monthNow = date.getMonth();
    const dayNow = date.getDate();

    const yearThen = new Date(birthday).getFullYear();
    const monthThen = new Date(birthday).getMonth();
    const dayThen = new Date(birthday).getDate();

    if (monthNow < monthThen || (monthNow === monthThen && dayNow <= dayThen)) {
      setAge(yearNow - yearThen - 1);
    } else {
      setAge(yearNow - yearThen);
    }
  }

  // Img Preview
  const [idPreview, setIdPreview] = useState(null);
 const [idFileName, setIdFileName] = useState("");
     
  // signature preview state
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState("");

  // set from backend
  useEffect(() => {
    if (info.signature_name) {
      const url = `http://localhost:5000/${info.signature_name}`;
      console.log("Loading backend signature URL:", url);
      setSignaturePreview(url);
    }
  }, [info.signature_name]);

  // on file change (upload new)
  function handleSignatureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // revoke old blob URL if exists
    if (signaturePreview && signaturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(signaturePreview);
    }

    const blobURL = URL.createObjectURL(file);
    setSignaturePreview(blobURL);
    setSignatureFileName(file.name);
  }
  useEffect(() => {
    if (info.picture_name) {
      setIdPreview(`http://localhost:5000/${info.picture_name}`);
    }
  }, [info.picture_name]);

  function handleIdImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setIdPreview(URL.createObjectURL(file));
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("age", age);
    fd.append("city", "San Juan");
    fd.append("province", "Metro Manila");
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/user/edit", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);
      setErrors({ ...data.errors });

      if (data.status === 429) {
        navigate("/too-many-requests");
      }

      if (data.success) {
        alert(
          "NOTE: You have edited your info, you will have to be reverified"
        );
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // SideBar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-white md:h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex justify-between items-center p-4 filter drop-shadow-[0_0_0.25rem_#0097A7]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer p-2 hover:text-cyan-700 hover:scale-110 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Account</h1>
          </div>

          {/* Profile Container */}
          <div className="flex gap-2">
            {/* <div className=" mx-2 hidden md:block">
                <div className="font-bold flex gap-1">
                  {info.first_name}

                  {info.last_name}
                </div>
                <p className="uppercase font-semibold text-sm text-right">
                  Senior Citizen
                </p>
              </div> */}
            <div className="hidden md:block">
              <p className="font-bold">
                {info.first_name} {info.last_name}
              </p>
              <p className="text-sm font-semibold uppercase text-right">
                Senior Citizen
              </p>
            </div>

            {/* <div className="bg-blue-300 size-11 rounded-full"></div> */}
            <img
              className="w-12 h-12 rounded-full object-cover border shadow"
              src={`http://localhost:5000/${info.picture_name}`}
            ></img>
          </div>
        </header>

        {/* SCROLLABLE  USER EDIT ACCOUNT CONTENT */}
        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {!status && <p style={{ color: "red" }}>{response}</p>}

          {/* <h3>User Edit</h3> */}
          <form onSubmit={handleEdit} className="flex flex-col gap-5">
            {/* UPLOADED IMG */}
            <div className="bg-blue-100 rounded-xl shadow-sm border border-blue-50 p-4 sm:p-5 flex flex-col gap-5 md:flex-row md:justify-around">
              {/* ID/PASSPORT PIC */}
              <div>
                <label className="text-lg font-semibold text-gray-700 mb-3">
                  1x1 / Passport Size Image
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="id_picture"
                  id="idUpload"
                  className="hidden"
                  onChange={handleIdImageChange}
                />

                <div className="flex flex-col">
                  {idPreview && (
                    <img
                      src={idPreview}
                      alt="ID Preview"
                      className="mt-3 w-32 h-32 object-cover rounded border"
                    />
                  )}

                  {/* no filename preview yet */}
                  {/* {idFileName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {idFileName}
                  </p>
                )} */}

                  <small className="text-red-500">{errors.id_picture}</small>
                </div>

                <label
                  htmlFor="idUpload"
                  className="inline-block cursor-pointer px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Choose ID Image
                </label>
              </div>

              {/* SIGNATURE */}
              <div>
                <label className="text-lg font-semibold text-gray-700 mb-3">
                  Signature on white background
                </label>

                <input
                  type="file"
                  id="signatureUpload"
                  name="signature_picture"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleSignatureChange}
                />

                {signaturePreview && (
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="mt-3 w-100 h-32 object-contain bg-white border rounded"
                    style={{ minHeight: "50px" }}
                  />
                )}

                {signatureFileName && (
                  <p className="text-sm text-gray-500 mt-1">
                    {signatureFileName}
                  </p>
                )}

                <label
                  htmlFor="signatureUpload"
                  className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
                >
                  Choose Signature Image
                </label>

                {errors?.signature_picture && (
                  <p className="text-red-500 mt-1">
                    {errors.signature_picture}
                  </p>
                )}
              </div>

              {/* <div className="mt-4">
                <label className="block font-medium mb-1">
                  Signature on white background
                </label>

                <input
                  type="file"
                  id="signatureUpload"
                  name="signature_picture"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleSignatureChange}
                />

                {signaturePreview ? (
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="mt-3 w-48 h-24 object-contain bg-white border rounded"
                    style={{ minHeight: "50px" }}
                  />
                ) : (
                  <div className="mt-3 w-48 h-24 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
                    No signature uploaded
                  </div>
                )}

                <label
                  htmlFor="signatureUpload"
                  className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
                >
                  Choose Signature Image
                </label>

                {errors?.signature_picture && (
                  <p className="text-red-500 mt-1">
                    {errors.signature_picture}
                  </p>
                )}
              </div> */}
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Personal Information
              </h3>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <small className="text-red-500">{errors.first_name}</small>
              </div>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">Middle Name</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    name="middle_name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>

                <small className="text-red-500">{errors.middle_name}</small>
              </div>

              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">Last Name</label>
                  <input
                    type="text"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <small className="text-red-500">{errors.last_name}</small>
              </div>

              {/* ADDRESS*/}
              <div>
                <label className="text-base font-semibold text-gray-600 mb-3">
                  Address
                </label>

                <div className="">
                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        House No. / Building / Lot No. *
                      </label>
                      <input
                        type="text"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        name="house"
                        value={house}
                        onChange={(e) => setHouse(e.target.value)}
                      />
                    </div>

                    <small className="text-red-500">{errors.house}</small>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        Street *
                      </label>
                      <input
                        type="text"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        name="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <small className="text-red-500">{errors.street}</small>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        Subdivision
                      </label>
                      <input
                        type="text"
                        name="subdivision"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        value={subdivision}
                        onChange={(e) => setSubdivision(e.target.value)}
                      />
                    </div>

                    <small className="text-red-500">{errors.subdivision}</small>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        Barangay *
                      </label>
                      <select
                        name="barangay"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                      >
                        <option>-- Please select an option --</option>
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
                    </div>

                    <small className="text-red-500">{errors.barangay}</small>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        City / Municipality
                      </label>
                      <input
                        type="text"
                        placeholder="San Juan"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled
                      />
                    </div>

                    <small className="text-red-500">{errors.city}</small>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                      <label className="text-gray-500 text-base">
                        Province
                      </label>
                      <input
                        type="text"
                        placeholder="Metro Manila"
                        className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                        name="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        disabled
                      />
                    </div>

                    <small style={{ color: "red" }}>{errors.province}</small>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={birthday}
                    onChange={(e) => {
                      setBirthday(e.target.value);
                      handleSetAge();
                    }}
                  />
                </div>

                <small className="text-red-500">{errors.birthday}</small>
              </div>

              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">Age</label>
                  <input
                    type="number"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    min="0"
                    max="150"
                    name="age"
                    value={age}
                    disabled
                  />
                </div>
                <small className="text-red-500">{errors.age}</small>
              </div>

              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">Gender</label>
                  <select
                    name="gender"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>-- Please select an option --</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <small className="text-red-500">{errors.gender}</small>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Contact Information
              </h3>

              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">Email</label>
                  <input
                    type="email"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <small className="text-red-500">{errors.email}</small>
              </div>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">
                    Emergency Contact's First Name
                  </label>
                  <input
                    type="text"
                    name="emergency_fname"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={emergencyFirstName}
                    onChange={(e) => setEmergencyFirstName(e.target.value)}
                  />
                </div>
                <small className="text-red-500">{errors.emergency_fname}</small>
              </div>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">
                    Emergency Contact's Middle Name
                  </label>
                  <input
                    type="text"
                    name="emergency_mname"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={emergencyMiddleName}
                    onChange={(e) => setEmergencyMiddleName(e.target.value)}
                  />
                </div>
                <small className="text-red-500">{errors.emergency_mname}</small>
              </div>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">
                    Emergency Contact's Last Name
                  </label>
                  <input
                    type="text"
                    name="emergency_lname"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={emergencyLastName}
                    onChange={(e) => setEmergencyLastName(e.target.value)}
                  />
                </div>
                <small className="text-red-500">{errors.emergency_lname}</small>
              </div>
              <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <label className="text-gray-500 text-base">
                    Emergency Contact's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="emergency_number"
                    className="border rounded w-full p-2 font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]"
                    value={emergencyNumber}
                    onChange={(e) => setEmergencyNumber(e.target.value)}
                  />
                </div>

                <small className="text-red-500">
                  {errors.emergency_number}
                </small>
              </div>
            </div>

            {/* SUBMIT & CANCEL BUTTON */}
            <div className="flex justify-between">
              <button className="px-4 py-2 bg-gray-300 rounded">
                <Link to="/user-dashboard">Cancel</Link>
              </button>

              <button
                className="px-4 py-2 bg-blue-700 text-white rounded"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>

          <ChangePass />
        </main>
      </div>
    </div>
  );
}
