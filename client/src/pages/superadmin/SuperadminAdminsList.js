import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";
import SuperadminCreateAdmins from "../../pages/superadmin/SuperadminCreateAdmins"

export default function SuperadminAdminsList() {
  // --------------------------
  // State
  // --------------------------
  const [admins, setAdmins] = useState([]);
  const [getAll, setGetAll] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [roles, setRoles] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setAdminID] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);


  async function fetchAdmins() {
    try {
      const res = await fetch(
        `/admins/info?get_all=${getAll}&page=${page}&per_page=${perPage}&keyword=${emailOrUsername}&sort=${sort}`,
        { method: "GET" },
      );
      const data = await res.json();
      setAdmins([...data.info]);
      setTotalPages(data.total_pages);

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

  async function fetchAdmin(e) {
    e.preventDefault();

    try {
      const res = await fetch(`/admins/info?id=${id}`, { method: "GET" });
      const data = await res.json();
      setEmail(data.info.email);
      setUsername(data.info.username);

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

  useEffect(() => {
    fetchAdmins();
  }, [sort, page]);

  const handleFetchAdmins = (e) => {
    e.preventDefault();
    fetchAdmins();
  };

  useEffect(() => {
    for (let i = 1; i <= totalPages; i++) {
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [totalPages]);

  useEffect(() => {
    async function getSuperadminID() {
      try {
        const res = await fetch("/superadmin/get-superadmin-id", {
          method: "GET",
        });
        const data = await res.json();
        if (data) {
          setCurrentAdmin(data.current_admin_id);

          if (data.status === 429) {
            navigate("/too-many-requests");
          }
          if (data.status === 403) {
            navigate("/forbidden");
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    getSuperadminID();
  }, []);

  useEffect(() => {
    setRoles(
      Object.fromEntries(admins.map((admin) => [admin.admin_id, admin.role])),
    );
  }, [admins]);

  async function changeRole(id, role) {
    const res = await fetch("/superadmin/edit-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ id, role }),
    });
    return res.json();
  }

  const handleChangeRole = async (id, role) => {
    setRoles((prev) => ({ ...prev, [id]: role }));

    try {
      const data = await changeRole(id, role);
      if (!data.exists) {
        alert(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        fetchAdmins();
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function handleEditAdmin(e) {
    e.preventDefault();

    try {
      const res = await fetch("/superadmin/edit-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          email,
          username,
        }),
      });
      const data = await res.json();
      setErrors({ ...data.errors });

      if (!data.exists) {
        alert(data.response);
      }
      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        setOpenEdit(false);
        fetchAdmins();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const editAdmin = (id, email, username) => {
    setOpenDelete(false);
    setOpenEdit(true);
    setAdminID(id);
    setEmail(email);
    setUsername(username);
  };

  async function handleDeleteAdmin(e) {
    e.preventDefault();

    try {
      const res = await fetch("/superadmin/delete-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          id,
        }),
      });
      const data = await res.json();

      if (!data.exists) {
        alert(data.response);
      }
      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        setOpenDelete(false);
        fetchAdmins();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const deleteAdmin = (id) => {
    setOpenEdit(false);
    setOpenDelete(true);
    setAdminID(id);
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen overflow-hidden">
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
            <h1 className="text-2xl font-bold">List of Admins</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto  px-5 py-3 bg-white">
          {/* <SuperadminCreateAdmins/> */}
          <div>
            {/* <h3>List of admin accounts</h3> */}
            <div className="grid md:grid-cols-3 gap-2">
              <form onSubmit={handleFetchAdmins}>
                <h3 className="font-semibold text-gray-500">Search</h3>
                <div className="relative flex justify-between  py-0 gap-0 border border-gray-300 rounded-md focus:outline-blue-600">
                  <div className="flex justify-center items-center  rounded focus:outline-blue-600 px-2">
                    {/* SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    <input
                      className="border-none outline-none w-full ps-2"
                      type="text"
                      placeholder="Search by Email or Name"
                      value={emailOrUsername}
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     e.preventDefault();
                      //   }}
                      // }
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 rounded-r py-1.5 px-6"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div>
                <p className="font-semibold text-gray-500">Filter By</p>
                <select
                  className="w-full border rounded px-3 py-1.5 "
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value={"All"}>All</option>
                  <option value={"admin"}>admin</option>
                  <option value={"superadmin"}>superadmin</option>
                </select>
              </div>

              <div>
                <p className="font-semibold text-gray-500">Sort By</p>
                <select
                  className="w-full border rounded px-3 py-1.5"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value={"Newest"}>Newest to Oldest</option>
                  <option value={"Oldest"}>Oldest to Newest</option>
                  <option value={"Updated"}>Last Updated</option>
                  <option value={"Unupdated"}>Last Unupdated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden">
            <div className="grid gap-2 md:flex md:justify-between mb-2">
              {/* <div className="md:flex md:justify-between mb-4"> */}
              <h3 className="text-2xl text-center font-bold text-gray-800">
                Admin and Superadmin's Account List Table
              </h3>

              <button
                onClick={() => setOpenCreate(true)}
                className="flex justify-center px-6 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Admin Account
              </button>
            </div>

            {openCreate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {/* <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-5"> */}
                <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative border-2 border-cyan-100 ">
                  {/* Close button */}
                  <button
                    onClick={() => setOpenCreate(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>

                  {/* Modal title */}
                  <h3 className="text-lg font-semibold text-cyan-600 mb-1">
                    Create an account
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create an account for Admin and Superadmin
                  </p>

                  <SuperadminCreateAdmins
                    onSuccess={() => {
                      setOpenCreate(false);
                      fetchAdmins(); // refresh list after creating admin
                    }}
                  />
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg shadow-md ">
              <table className="min-w-[1400px] w-full border-collapse ">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-start">Username</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-start">Role</th>
                    <th className="px-4 py-3 text-start">Created</th>
                    <th className="px-4 py-3 text-start">Updated</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y text-sm">
                  {admins
                    .filter((admin) => admin.admin_id !== currentAdmin)
                    // .filter(admin => {
                    //   return emailOrUsername === "" ? admin :
                    //   admin.username.includes(emailOrUsername.toLowerCase()) ||
                    //   admin.email.includes(emailOrUsername.toLowerCase())
                    // })
                    .filter((admin) => {
                      return filter === "All" ? admin : admin.role === filter;
                    })
                    .map((admin) => (
                      <tr key={admin.admin_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{admin.admin_id}</td>
                        <td className="px-4 py-3">{admin.username}</td>
                        <td className="px-4 py-3">{admin.email}</td>
                        <td className="px-4 py-3">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={roles[admin.admin_id]}
                            onChange={(e) =>
                              handleChangeRole(admin.admin_id, e.target.value)
                            }
                          >
                            <option>admin</option>
                            <option>superadmin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">{admin.created_at}</td>
                        <td className="px-4 py-3">{admin.updated_at}</td>
                        <td className="px-4 py-3 grid grid-cols-1 gap-2 justify-center">
                          <button
                            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() =>
                              editAdmin(
                                admin.admin_id,
                                admin.email,
                                admin.username,
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                            onClick={() => deleteAdmin(admin.admin_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION  */}
          <div className="flex justify-center items-center gap-2 mt-4">
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

          {openEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {/* <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-5"> */}
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative border-2 border-cyan-100 ">
                  {/* Close button */}
                  <button
                    onClick={() => setOpenEdit(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>

                  {/* Modal title */}
                  <h3 className="text-lg font-semibold text-cyan-600 mb-1">
                    Edit account
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Edit an account for Admin and Superadmin
                  </p>

                  <form onSubmit={handleEditAdmin} className="bg-white">
                    {!status && <p className="text-red-500">{response}</p>}

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="text-sm text-gray-600">
                          Username
                        </label>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2"
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <small className="text-red-500">
                          {errors.username}
                        </small>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2"
                          type="email"
                          placeholder="email@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <small className="text-red-500">{errors.email}</small>
                      </div>
                    </div>

                    {/* <button onClick={(e) => fetchAdmin(e)}>Reset</button> */}

                    <div className="flex justify-between items-center">
                      <button
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        onClick={() => {
                          setOpenEdit(false);
                          setErrors({});
                          setResponse("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-8 py-2 rounded bg-white border border-blue-700 text-blue-700 font-medium"
                        onClick={(e) => fetchAdmin(e)}
                      >
                        Reset
                      </button>
                      <button
                        className="px-10 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {openDelete && (
            <div className="popup">
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative border border-red-500 ">
                  {/* Close button */}
                  <button
                    onClick={() => setOpenDelete(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>

                  <form
                    onSubmit={handleDeleteAdmin}
                    className="flex flex-col gap-4 items-center"
                  >
                    <div className="flex justify-center sm:justify-start">
                      <div className="size-28 rounded-full bg-red-600 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-20 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-2xl text-center font-semibold text-gray-700">
                        Are you sure you want to delete this Admin Account?
                      </p>
                      <p className="text-sm tracking-wider text-center font-semibold text-gray-500">
                        This action will delete this entire account, including
                        all saved data. This cannot be undone.
                      </p>
                    </div>
                    {/* <label>Delete Confirmation for {id}</label> */}
                    <div>
                      <div className="flex justify-between items-center gap-4">
                        <button
                          className="px-6 md:px-8 py-2 rounded bg-gray-200 hover:bg-gray-300"
                          onClick={() => setOpenDelete(false)}
                        >
                          No, cancel
                        </button>
                        <button
                          className="px-10 md:px-12 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-medium"
                          type="submit"
                        >
                          Yes, Delete Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* <button>
            <Link to="/superadmin-dashboard">Go back</Link>
          </button> */}
        </main>
      </div>
    </div>
  );
}
