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
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <h1 className="text-2xl font-bold">List of Admin</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-white">
          <SuperadminCreateAdmins/>
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

          <table className="hidden">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
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
                  <tr key={admin.admin_id}>
                    <td>{admin.admin_id}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                      <select
                        value={roles[admin.admin_id]}
                        onChange={(e) =>
                          handleChangeRole(admin.admin_id, e.target.value)
                        }
                      >
                        <option>admin</option>
                        <option>superadmin</option>
                      </select>
                    </td>
                    <td>{admin.created_at}</td>
                    <td>{admin.updated_at}</td>
                    <td>
                      <button
                        onClick={() =>
                          editAdmin(admin.admin_id, admin.email, admin.username)
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteAdmin(admin.admin_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mt-6 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Admin and Superadmin's Account List Table
            </h3>

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

          {openEdit && (
            <div className="popup">
              <form onSubmit={handleEditAdmin}>
                {!status && <p style={{ color: "red" }}>{response}</p>}

                <label>Editing Admin {id}</label>
                <br />
                <label>Email</label>
                <input
                  type="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>{errors.email}</small>
                <br />

                <label>Username</label>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>{errors.username}</small>
                <br />

                <button onClick={(e) => fetchAdmin(e)}>Reset</button>
                <br />

                <button type="submit">Edit Admin</button>
              </form>

              <button
                onClick={() => {
                  setOpenEdit(false);
                  setErrors({});
                  setResponse("");
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {openDelete && (
            <div className="popup">
              <form onSubmit={handleDeleteAdmin}>
                <label>Delete Confirmation for Admin {id}</label>
                <br />
                <p>Are you sure you want to delete this admin?</p>

                <button type="submit">Delete Admin</button>
              </form>

              <button onClick={() => setOpenDelete(false)}>Cancel</button>
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
