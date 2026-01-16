import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function AdminDashboard() {
  const [info, setInfo] = useState({});
  const [celebrants, setCelebrants] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAdminInfo() {
      try {
        const res = await fetch("/admins/info", {
          method: "GET",
        });
        const data = await res.json();
        setInfo((prev) => ({
          ...prev,
          ...data.info,
        }));

        if (!data.success) {
          alert(data.response);
        }
        if (data.status === 429) {
          navigate("/too-many-requests");
        }
        if (data.status === 403) {
          navigate("/forbidden");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getAdminInfo();
  }, []);

  useEffect(() => {
    async function getAdminsInfo() {
      try {
        const res = await fetch("/admin/dashboard", {
          method: "GET",
        });
        const data = await res.json();
        setInfo((prev) => ({
          ...prev,
          ...data.info,
        }));

        if (!data.success) {
          alert(data.response);
        }
        if (data.status === 429) {
          navigate("/too-many-requests");
        }
        if (data.status === 403) {
          navigate("/forbidden");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getAdminsInfo();
  }, []);

  async function fetchCelebrants() {
    try {
      const res = await fetch(
        `/admins/get-celebrants?page=${page}&per_page=${perPage}`,
        { method: "GET" }
      );
      const data = await res.json();
      const processedList = data.celebrants.map((u) => ({
        ...u,
        birthday: new Date(u.birthday).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      }));
      setCelebrants(processedList);
      setPictures(data.pictures);
      setSignatures(data.signatures);
      setTotalPages(data.total_pages);

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCelebrants();
  }, [page]);

  useEffect(() => {
    for (let i = 1; i <= totalPages; i++) {
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [totalPages]);

  // SideBar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex bg-white md:h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex items-center p-4 filter drop-shadow-[0_0_0.25rem_#0097A7]">
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
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Profile Container */}
          {/* <div className="flex gap-2">
          
            <div className="hidden md:block">
              <p className="font-bold">
                {info.first_name} {info.last_name}
              </p>
              <p className="text-sm font-semibold uppercase text-right">
                ADMIN
              </p>
            </div>


            <img
              className="w-12 h-12 rounded-full object-cover border shadow"
              src={`http://localhost:5000/${info.picture_name}`}
            ></img>
          </div> */}
          {/* <div className="flex gap-2">
            <div className="text-xl font-bold flex items-center">
              <h2 className="uppercase text-sm font-bold text-blue-700 text-center">
                Senior Citizen System
              </h2>

              <img
                // src="seniorLogo.jpg"
                className="bg-cyan-700 rounded-full w-12 h-12 md:mx-1"
              />
            </div>
          </div> */}
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-white">
          <h3>Admin Dashboard</h3>
          <p>Hello {info.username}</p>
          <ul>
            <li>Email: {info.email}</li>
            <li>Role: {info.role}</li>
            <li>ID: {info.admin_id}</li>
          </ul>
          <ol>
            <div className="bg-white  border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
              <h3 className="text-4xl">12</h3>
              <p className="uppercase">Number of Seniors</p>
            </div>
            <li>Unverified Seniors: {info.unverified_seniors}</li>

            <li>Verified Seniors: {info.verified_seniors}</li>
            <li>Total Seniors: {info.senior_accounts}</li>
          </ol>

          <h3>Seniors with birthdays</h3>
          <table className="bg-red-500 ">
            <thead>
              <tr>
                <th>ID</th>
                <th>Picture</th>
                <th>Signature</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>
                  Birthday
                  <br />
                  <small>mm/dd/yyyy</small>
                </th>
              </tr>
            </thead>

            <tbody>
              {celebrants.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No Celebrants Today
                  </td>
                </tr>
              ) : (
                celebrants.map((celebrant) => (
                  <tr key={celebrant.senior_id}>
                    <td>{celebrant.senior_id}</td>

                    <td>
                      {pictures.map(
                        (picture) =>
                          picture.senior_id === celebrant.senior_id && (
                            <img
                              id={picture.picture_id}
                              src={picture.picture_name}
                              width={"50px"}
                            ></img>
                          )
                      )}
                    </td>

                    <td>
                      {signatures.map(
                        (signature) =>
                          signature.senior_id === celebrant.senior_id && (
                            <img
                              id={signature.signature_id}
                              src={signature.image_name}
                              width={"50px"}
                            ></img>
                          )
                      )}
                    </td>

                    <td>
                      {celebrant.first_name}
                      {celebrant.middle_name}
                      {celebrant.last_name}
                    </td>

                    <td>{celebrant.email}</td>
                    <td>{celebrant.age}</td>
                    <td>{celebrant.birthday}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            {pages.map((num) => (
              <button
                key={num}
                style={page === num ? { color: "red" } : {}}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}