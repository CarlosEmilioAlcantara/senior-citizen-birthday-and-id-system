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
          {/* <h3>Admin Dashboard</h3> */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-cyan-600 to-blue-700 text-white p-8 shadow-lg">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold">
                Welcome back, {info.username} 👋
              </h2>
              <p className="mt-2 text-cyan-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="text-cyan-100">Email</p>
                  <p className="font-semibold break-all">{info.email}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="text-cyan-100">Role</p>
                  <p className="font-semibold uppercase">{info.role}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="text-cyan-100">Admin ID</p>
                  <p className="font-semibold">{info.admin_id}</p>
                </div>
              </div>
            </div>

            {/* Decorative Blur */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          </section>
          <ol>
            <div className=" grid md:grid-cols-2 gap-3 mx-3 mt-3 md:my-3 md:mx-0 text-gray-800">
              {/* <div className="bg-white  border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
                <h3 className="text-4xl">{info.senior_accounts}</h3>
                <p className="uppercase">Total Seniors</p>
              </div> */}

              <div className="bg-white border border-gray-200 rounded-md shadow-md cursor-pointer py-1">
                <div className="pt-5 px-8 flex justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                      clipRule="evenodd"
                    />
                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                  </svg>
                </div>

                <div className="text-center font-bold pb-6">
                  <h3 className="text-4xl">{info.senior_accounts}</h3>
                  <p className="uppercase"> Total Number of Seniors</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white  border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
                  <h3 className="text-4xl">{info.verified_seniors}</h3>
                  <p className="uppercase">Verified Seniors</p>
                </div>

                <div className="bg-white  border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
                  <h3 className="text-4xl">{info.unverified_seniors}</h3>
                  <p className="uppercase">Unverified Seniors </p>
                </div>
              </div>
            </div>
          </ol>

          <h3>Seniors with birthdays</h3>
          <table className="bg-blue-700 ">
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
                          ),
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
                          ),
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