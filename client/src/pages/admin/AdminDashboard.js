import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --------------------------
  // State
  // --------------------------
  const [info, setInfo] = useState({});
  const [celebrants, setCelebrants] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --------------------------
  // Fetch admin info (combined)
  // --------------------------
  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [resInfo, resDashboard] = await Promise.all([
          fetch("/admins/info"),
          fetch("/admin/dashboard"),
        ]);

        const dataInfo = await resInfo.json();
        const dataDashboard = await resDashboard.json();

        setInfo({
          ...dataInfo.info,
          ...dataDashboard.info,
        });

        // Handle alerts
        if (!dataInfo.success) alert(dataInfo.response);
        if (!dataDashboard.success) alert(dataDashboard.response);

        // Handle status redirects
        if ([dataInfo.status, dataDashboard.status].includes(429)) {
          navigate("/too-many-requests");
        }
        if ([dataInfo.status, dataDashboard.status].includes(403)) {
          navigate("/forbidden");
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchAdminData();
  }, [navigate]);

  // --------------------------
  // Fetch celebrants
  // --------------------------
  async function fetchCelebrants() {
    try {
      const res = await fetch(
        `/admins/get-celebrants?page=${page}&per_page=${perPage}`,
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

      if (data.status === 429) navigate("/too-many-requests");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCelebrants();
  }, [page, perPage]);

  // --------------------------
  // Pagination pages
  // --------------------------
  useEffect(() => {
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [totalPages]);


  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-white flex items-center p-4 drop-shadow-[0_0_0.25rem_#0097A7]">
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
              className="w-6 h-6"
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
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-white">
          {/* WELCOME SECTION */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-700 text-white p-8 shadow-md mb-8">
            {/* <h2 className="text-3xl md:text-4xl font-bold">
              Welcome back, {info.username} 👋
            </h2>
            <p className="mt-2 text-cyan-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p> */}
            <h2 className="text-3xl md:text-4xl font-bold">
              Welcome back, {info?.username || "Admin"} 👋
            </h2>

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

            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          </section>

          {/* SUMMARY CARDS */}
          <div className="grid md:grid-cols-2 gap-3 text-gray-800 mb-10">
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
                <p className="uppercase">Total Number of Seniors</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
                <h3 className="text-4xl">{info.verified_seniors}</h3>
                <p className="uppercase">Number of Verified Seniors</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-md shadow-md text-center font-bold p-6">
                <h3 className="text-4xl">{info.unverified_seniors}</h3>
                <p className="uppercase">Number of Unverified Seniors</p>
              </div>
            </div>
          </div>

          {/* BIRTHDAYS TABLE */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Seniors with Birthdays
            </h3>

            {/* Desktop Table */}
            <div className="overflow-x-auto bg-white rounded-md shadow-md hidden md:block">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-slate-100 text-gray-600 uppercase text-base">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Picture</th>
                    <th className="px-4 py-3">Signature</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">
                      Birthday
                      <br />
                      <small>mm/dd/yyyy</small>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-base">
                  {celebrants.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-10 text-gray-500"
                      >
                        No celebrants today 🎉
                      </td>
                    </tr>
                  ) : (
                    celebrants.map((celebrant) => (
                      <tr
                        key={celebrant.senior_id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">{celebrant.senior_id}</td>
                        <td className="px-4 py-3">
                          {pictures
                            .filter((p) => p.senior_id === celebrant.senior_id)
                            .map((p) => (
                              <img
                                key={p.picture_id}
                                src={p.picture_name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ))}
                        </td>
                        <td className="px-4 py-3">
                          {signatures
                            .filter((s) => s.senior_id === celebrant.senior_id)
                            .map((s) => (
                              <img
                                key={s.signature_id}
                                src={s.image_name}
                                className="w-12 h-12 object-contain"
                              />
                            ))}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {celebrant.first_name} {celebrant.middle_name}{" "}
                          {celebrant.last_name}
                        </td>
                        <td className="px-4 py-3">{celebrant.email}</td>
                        <td className="px-4 py-3">{celebrant.age}</td>
                        <td className="px-4 py-3">{celebrant.birthday}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
              {celebrants.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No celebrants today 🎉
                </p>
              ) : (
                celebrants.map((celebrant) => (
                  <div
                    key={celebrant.senior_id}
                    className="bg-white border border-gray-200 rounded-md shadow-md p-4"
                  >
                    <div className="flex items-center mb-2">
                      {pictures
                        .filter((p) => p.senior_id === celebrant.senior_id)
                        .map((p) => (
                          <img
                            key={p.picture_id}
                            src={p.picture_name}
                            className="w-12 h-12 rounded object-cover mr-2"
                          />
                        ))}
                      <div>
                        <p className="font-medium">
                          {celebrant.first_name} {celebrant.middle_name}{" "}
                          {celebrant.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {celebrant.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <p>Age: {celebrant.age}</p>
                      <p>Birthday: {celebrant.birthday}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded border disabled:opacity-40"
              >
                Prev
              </button>

              {pages.map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded border ${
                    page === num
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
