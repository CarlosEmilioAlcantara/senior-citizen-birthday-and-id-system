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
    // const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-white md:h-screen ">
       <Sidebar /> 

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex justify-between items-center p-4 filter drop-shadow-[0_0_0.25rem_#0097A7]">
          <button
            // onClick={() => setSidebarOpen(true)}
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex gap-2">
            {/* Admin Profile Container */}
            <div className="flex">
              <div className="bg-blue-300 size-11 rounded-full"></div>
              <div className=" mx-2 hidden md:block">
                <h2 className="font-bold">Complete Name</h2>
                <p className="uppercase font-semibold text-sm text-right">
                  Senior Citizen
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE  USER DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {verificationStatus && birthdayNear && (
            <h3 style={{ color: "blue" }}>
              Your birthday is near! You may get your birthday payout at the
              establishment.
            </h3>
          )}

          {verificationStatus ? (
            <h3 style={{ color: "green" }}>You are verified</h3>
          ) : (
            <h3 style={{ color: "red" }}>You are still unverified</h3>
          )}

          <h3>User Dashboard</h3>
          <li className="list-none">
            <h3>Senior Image</h3>
            <img
              width="150"
              src={`http://localhost:5000/${info.picture_name}`}
            ></img>
            <h3>Senior Signature</h3>
            <img
              width="150"
              src={`http://localhost:5000/${info.image_name}`}
            ></img>
            <h3>
              Fullname: {info.first_name} {info.middle_name} {info.last_name}
            </h3>
            <h3>Email: {info.email}</h3>
            <h3>Address: {info.address}</h3>
            <h3>Age: {info.age}</h3>
            <h3>Birthday: {info.birthday}</h3>
            <h3>Gender: {info.gender}</h3>
            <h3>
              Emergency Contact Name: {info.emergency_fname}{" "}
              {info.emergency_mname} {info.emergency_lname}
            </h3>
            <h3>Emergency Contact #: {info.emergency_number}</h3>
            <h3>Card Picture:</h3>
          </li>
        </main>
      </div>
    </div>
  );
}