import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";

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
    setEmail(info.email);
    setFirstName(info.first_name);
    setMiddleName(info.middle_name);
    setLastName(info.last_name);
    setHouse(info.house);
    setStreet(info.street);
    setSubdivision(info.subdivision);
    setBarangay(info.barangay);
    setCity(info.city);
    setProvince(info.province);
    setBirthday(info.birthday);
    setAge(info.age);
    setGender(info.gender);
    setEmergencyFirstName(info.emergency_fname);
    setEmergencyMiddleName(info.emergency_mname);
    setEmergencyLastName(info.emergency_lname);
    setEmergencyNumber(info.emergency_number);
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
        navigate("/");
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

          {/* Admin Profile Container */}
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

          <h3>User Edit</h3>
          <form onSubmit={handleEdit}>
            <label>1x1 / Passport Size Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              name="id_picture"
            />
            <br />
            <small style={{ color: "red" }}>{errors.id_picture}</small>
            <br />

            <label>Signature on white background</label>
            <input type="file" name="signature_picture" />
            <br />
            <small style={{ color: "red" }}>{errors.signature_picture}</small>
            <br />

            <label>Email</label>
            <input
              type="email"
              placeholder="Email..."
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.email}</small>
            <br />

            <label>First Name</label>
            <input
              type="text"
              placeholder="First name..."
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.first_name}</small>
            <br />

            <label>Middle Name</label>
            <input
              type="text"
              placeholder="Middle name..."
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.middle_name}</small>
            <br />

            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last name..."
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.last_name}</small>
            <br />

            <label>Address</label>
            <br />
            <label>House No. / Building / Lot No. *</label>
            <input
              type="text"
              placeholder="144"
              name="house"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.house}</small>
            <br />

            <label>Street *</label>
            <input
              type="text"
              placeholder="Bayabas St."
              name="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.street}</small>
            <br />

            <label>Subdivision</label>
            <input
              type="text"
              placeholder="Sayote Village"
              name="subdivision"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.subdivision}</small>
            <br />

            <label>Barangay *</label>
            <select
              name="barangay"
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
            <br />
            <small style={{ color: "red" }}>{errors.barangay}</small>
            <br />

            <label>City / Municipality</label>
            <input
              type="text"
              placeholder="San Juan"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled
            />
            <br />
            <small style={{ color: "red" }}>{errors.city}</small>
            <br />

            <label>Province</label>
            <input
              type="text"
              placeholder="Metro Manila"
              name="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              disabled
            />
            <br />
            <small style={{ color: "red" }}>{errors.province}</small>
            <br />

            <label>Date of Birth</label>
            <input
              type="date"
              name="birthday"
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value);
                handleSetAge();
              }}
            />
            <br />
            <small style={{ color: "red" }}>{errors.birthday}</small>
            <br />

            <label>Age</label>
            <input
              type="number"
              min="0"
              max="150"
              name="age"
              value={age}
              disabled
            />
            <br />
            <small style={{ color: "red" }}>{errors.age}</small>
            <br />

            <label>Gender</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>-- Please select an option --</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <br />
            <small style={{ color: "red" }}>{errors.gender}</small>
            <br />

            <label>Emergency Contact's First Name</label>
            <input
              type="text"
              name="emergency_fname"
              value={emergencyFirstName}
              onChange={(e) => setEmergencyFirstName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_fname}</small>
            <br />

            <label>Emergency Contact's Middle Name</label>
            <input
              type="text"
              name="emergency_mname"
              value={emergencyMiddleName}
              onChange={(e) => setEmergencyMiddleName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_mname}</small>
            <br />

            <label>Emergency Contact's Last Name</label>
            <input
              type="text"
              name="emergency_lname"
              value={emergencyLastName}
              onChange={(e) => setEmergencyLastName(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_lname}</small>
            <br />

            <label>Emergency Contact's Contact Number</label>
            <input
              type="tel"
              name="emergency_number"
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
            />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_number}</small>
            <br />

            <button type="submit">Submit</button>
          </form>
          <button>
            <Link to="/">Cancel</Link>
          </button>
        </main>
      </div>
    </div>
  );
}