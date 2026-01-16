import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const [info, setInfo] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [birthdayNear, setBirthdayNear] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await fetch("/user/info", {
          method: "GET"
        })
        const data = await res.json();
        setInfo({...data.info});

        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getUserInfo();
  }, [])

  useEffect(() => {
    async function getVerificationStatus() {
      try {
        const res = await fetch("/user/get-verification-status", {
          method: "GET",
        })
        const data = await res.json();
        if (!data.success) {
          alert(data.response);
        } else {
          setVerificationStatus(data.verification);
        }

        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getVerificationStatus();
  }, [])

  useEffect(() => {
    async function getBirthdayNear() {
      try {
        const res = await fetch("/user/check-birthday", {
          method: "GET"
        })
        const data = await res.json();
        setBirthdayNear(data.birthday_near);
        
        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getBirthdayNear();
  }, [])


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
            <h1 className="text-2xl font-bold">Profile</h1>
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

        {/* SCROLLABLE  USER DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {/* <h3>User Dashboard</h3> */}
          <li className="list-none">
            {/* Profile Photo & Senior Signature */}
            <div className="bg-blue-100 rounded-xl shadow-sm border border-blue-50 p-4 sm:p-5 mb-5 flex flex-col gap-5 md:flex-row md:justify-around">
              {/* Profile Photo */}
              <div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Profile Photo
                  </h3>
                  <h4 className="text-xs font-semibold text-gray-700">
                    1x1 / Passport Size Image
                  </h4>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    className="w-32 h-32 object-cover border shadow"
                    src={`http://localhost:5000/${info.picture_name}`}
                    alt="Profile"
                  />

                  <div className="text-center sm:text-left">
                    <h2 className="font-bold text-lg">
                      {info.first_name} {info.last_name}
                    </h2>
                    <p className="uppercase font-semibold text-sm">
                      Senior Citizen
                    </p>
                  </div>
                </div>
              </div>

              {/*(SIGNATURE) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Signature on white background
                </h3>

                <div className="flex justify-center">
                  <img
                    className="w-100 h-32 object-cover border shadow"
                    src={`http://localhost:5000/${info.image_name}`}
                  ></img>
                </div>
              </div>
            </div>

            {/* Personal, Contact Info and Senior ID Details */}
            <div className="flex flex-col gap-5">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Personal Information
                </h3>

                <div>
                  {[
                    ["First Name", info.first_name],
                    ["Middle Name", info.middle_name],
                    ["Last Name", info.last_name],
                    ["Date of Birth", info.birthday],
                    ["Age", info.age],
                    ["Gender", info.gender],
                    ["Address", info.address],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2"
                    >
                      <span className="text-gray-500 text-base">{label}</span>
                      <span className="font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl border p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Contact Information
                </h3>

                <div>
                  {[
                    ["Email", info.email],
                    ["Emergency First Name", info.emergency_fname],
                    ["Emergency Middle Initial", info.emergency_mname],
                    ["Emergency Last Name", info.emergency_lname],
                    ["Emergency Contact Number", info.emergency_number],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2"
                    >
                      <span className="text-gray-500 text-base">{label}</span>
                      <span className="font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Senior ID Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Senior ID Details
                </h3>

                {/* CARD PICTURE */}
                <div className="mb-4">
                  <p className="text-gray-500 text-base mb-2">Card Picture</p>

                  <div className="flex justify-center sm:justify-start">
                    <div className="w-64 h-40 bg-gray-100 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                      {/* PLACEHOLDER IMAGE */}
                      <img
                        src="https://via.placeholder.com/256x160?text=Senior+ID+Card"
                        alt="Senior ID Card"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* ID NUMBER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <span className="text-gray-500 text-base">ID Number</span>
                  <span className="font-medium text-gray-700 text-lg sm:text-base break-words sm:text-right max-w-full sm:max-w-[70%]">
                    ID xx-xxxx-xxxx
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-2">
                  <span className="text-gray-500 text-base">Status</span>

                  <div>
                    {verificationStatus && birthdayNear && (
                      <p className="text-blue-600 text-sm mb-1">
                        🎉 Your birthday is near! You may get your payout.
                      </p>
                    )}

                    {verificationStatus ? (
                      <p className="font-medium text-green-600 text-lg sm:text-base break-words sm:text-right max-w-full">
                        Verified
                      </p>
                    ) : (
                      <p className="font-medium text-red-600 text-lg sm:text-base break-words sm:text-right max-w-full">
                        Unverified
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg-blue-100 p-2 hidden">
              <h3>  
                Fullname: {info.first_name} {info.middle_name} {info.last_name}
              </h3>
              <h3>Birthday: {info.birthday}</h3>
              <h3>Age: {info.age}</h3>

              <h3>Gender: {info.gender}</h3>

              <h3>Address: {info.address}</h3>
              <h3>Email: {info.email}</h3>

              <h3>
                Emergency Contact Name: {info.emergency_fname}{" "}
                {info.emergency_mname} {info.emergency_lname}
              </h3>
              <h3>Emergency Contact #: {info.emergency_number}</h3>
              <h3>Card Picture:</h3>
            </div> */}
          </li>
        </main>
      </div>
    </div>
  );
}