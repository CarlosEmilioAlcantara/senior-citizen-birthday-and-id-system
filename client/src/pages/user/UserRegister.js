import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [birthday, setBirthday] = useState("1955-01-01");
  const [age, setAge] = useState(null);

  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function handleSetAge() {
    const date = new Date();
    const yearNow = date.getFullYear();
    const monthNow = date.getMonth();
    const dayNow = date.getDate();

    const yearThen = new Date(birthday).getFullYear();
    const monthThen = new Date(birthday).getMonth();
    const dayThen = new Date(birthday).getDate();

    if (monthNow < monthThen || (
      monthNow === monthThen && dayNow <= dayThen
    )) {
      setAge(yearNow - yearThen - 1)
    } else {
      setAge(yearNow - yearThen)
    }
  }

  async function handleExists(e) {
    e.preventDefault();

    try {
      const res = await fetch("/auth/exists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, 
          password, 
          confirm,
        }),
      })
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("age", age);
    fd.append("city", "San Juan");
    fd.append("province", "Metro Manila");

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        body: fd,
      })
      const data = await res.json();
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.success) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {!status && <p style={{ color: "red" }}>{response}</p>}

      {status ? (
        <div>
          <h3>User Register</h3>
          <form onSubmit={handleRegister}>
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

            <label>First Name</label>
            <input type="text" placeholder="First name..." name="first_name" />
            <br />
            <small style={{ color: "red" }}>{errors.first_name}</small>
            <br />

            <label>Middle Name</label>
            <input
              type="text"
              placeholder="Middle name..."
              name="middle_name"
            />
            <br />
            <small style={{ color: "red" }}>{errors.middle_name}</small>
            <br />

            <label>Last Name</label>
            <input type="text" placeholder="Last name..." name="last_name" />
            <br />
            <small style={{ color: "red" }}>{errors.last_name}</small>
            <br />

            <label>Address</label>
            <br />
            <label>House No. / Building / Lot No. *</label>
            <input type="text" placeholder="144" name="house" />
            <br />
            <small style={{ color: "red" }}>{errors.house}</small>
            <br />

            <label>Street *</label>
            <input type="text" placeholder="Bayabas St." name="street" />
            <br />
            <small style={{ color: "red" }}>{errors.street}</small>
            <br />

            <label>Subdivision</label>
            <input
              type="text"
              placeholder="Sayote Village"
              name="subdivision"
            />
            <br />
            <small style={{ color: "red" }}>{errors.subdivision}</small>
            <br />

            <label>Barangay *</label>
            <select name="barangay">
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
              value="San Juan"
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
              value="Metro Manila"
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
            <select name="gender">
              <option>-- Please select an option --</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <br />
            <small style={{ color: "red" }}>{errors.gender}</small>
            <br />

            <label>Emergency Contact's First Name</label>
            <input type="text" name="emergency_fname" />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_fname}</small>
            <br />

            <label>Emergency Contact's Middle Name</label>
            <input type="text" name="emergency_mname" />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_mname}</small>
            <br />

            <label>Emergency Contact's Last Name</label>
            <input type="text" name="emergency_lname" />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_lname}</small>
            <br />

            <label>Emergency Contact's Contact Number</label>
            <input type="tel" name="emergency_number" maxLength={13} />
            <br />
            <small style={{ color: "red" }}>{errors.emergency_number}</small>
            <br />

            <button type="submit">Submit</button>
          </form>
          <button type="submit" onClick={() => setStatus(false)}>
            Cancel
          </button>
        </div>
      ) : (
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
          <div className="flex flex-col justify-center  p-12 lg:p-20 ">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Create an Account
            </h2>

            <form onSubmit={handleExists} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="example@email.com"
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-red-500">{errors.confirm}</p>
              </div>

              <button
                className="mt-8 w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 cursor-pointer"
                type="submit"
              >
                Create an account
              </button>
            </form>

            <div className="text-center my-6">
              <span className="text-sm text-gray-600 cursor-pointer flex justify-center gap-1">
                <span>Already have an account yet?</span>
                <Link
                  to="/user-login"
                  className="hover:underline text-blue-600 font-semibold"
                >
                  Login here
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}