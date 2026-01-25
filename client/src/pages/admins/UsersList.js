import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";
import Sidebar from "../../components/Sidebar";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [verifications, setVerifications] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [emailOrFullname, setEmailOrFullname] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function fetchUsers() {
    try {
      const res = await fetch(
        `/admins/users-list?page=${page}&per_page=${perPage}&keyword=${emailOrFullname}&sort=${sort}`,
        { method: "GET" },
      );
      const data = await res.json();
      const processedList = data.list.map((u) => ({
        ...u,
        birthday: new Date(u.birthday).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      }));
      setUsers([...processedList]);
      setPictures([...data.pictures]);
      setSignatures([...data.signatures]);
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

  const handleFetchUsers = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [sort, page]);

  useEffect(() => {
    for (let i = 1; i <= totalPages; i++) {
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [totalPages]);

  useEffect(() => {
    setVerifications(
      Object.fromEntries(
        users.map((user) => [
          user.senior_id,
          (user.verify_status && "Verified") || "Unverified",
        ]),
      ),
    );
  }, [users]);

  async function handleVerificationChange(id, email, verification) {
    setVerifications((prev) => ({ ...prev, [id]: verification }));

    try {
      const res = await fetch("/admins/edit-senior-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ id, email, verification }),
      });
      const data = await res.json();
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
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const [id, setID] = useState(null);
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

  const setUserInfo = (
    id,
    first_name,
    middle_name,
    last_name,
    email,
    age,
    birthday,
    gender,
    house,
    street,
    subdivision,
    barangay,
    city,
    province,
    emergency_fname,
    emergency_mname,
    emergency_lname,
    emergency_number,
    edit = false,
  ) => {
    if (edit) {
      const [month, day, year] = birthday.split("/");
      const isoDate = `${year}-${month}-${day}`;
      setBirthday(isoDate);
    } else {
      setBirthday(birthday);
    }

    setID(id);
    setEmail(email);
    setFirstName(first_name);
    setMiddleName(middle_name);
    setLastName(last_name);
    setHouse(house);
    setStreet(street);
    setSubdivision(subdivision);
    setBarangay(barangay);
    setCity(city);
    setProvince(province);
    setAge(age);
    setGender(gender);
    setEmergencyFirstName(emergency_fname);
    setEmergencyMiddleName(emergency_mname);
    setEmergencyLastName(emergency_lname);
    setEmergencyNumber(emergency_number);
  };

  async function fetchUser(e) {
    e.preventDefault();

    try {
      const res = await fetch(`/admins/users-list?id=${id}`, { method: "GET" });
      const data = await res.json();
      const processedBirthday = new Date(data.info.birthday).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        },
      );
      setUserInfo(
        id,
        data.info.first_name,
        data.info.middle_name,
        data.info.last_name,
        data.info.email,
        data.info.age,
        processedBirthday,
        data.info.gender,
        data.info.house,
        data.info.street,
        data.info.subdivision,
        data.info.barangay,
        data.info.city,
        data.info.province,
        data.info.emergency_fname,
        data.info.emergency_mname,
        data.info.emergency_lname,
        data.info.emergency_number,
        true,
      );

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

  async function handleEditUser(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("id", id);
    fd.append("age", age);
    fd.append("city", "San Juan");
    fd.append("province", "Metro Manila");
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/admins/edit-senior", {
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
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        alert(`Senior ${id} edited`);
        setOpenEdit(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteUser(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("id", id);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/admins/delete-senior", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
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
        alert(`Senior ${id}'s deleted`);
        setOpenDelete(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePrintID() {
    try {
      const res = await fetch("/admins/print-id", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          id: id,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          email: email,
          birthday: birthday,
          age: age,
          gender: gender,
          house: house,
          street: street,
          subdivision: subdivision,
          barangay: barangay,
          city: city,
          province: province,
          emergency_fname: emergencyFirstName,
          emergency_mname: emergencyMiddleName,
          emergency_lname: emergencyLastName,
          emergency_number: emergencyNumber,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        setCardFront(`${data.id_front}?${Date.now()}`);
        setCardBack(`${data.id_back}?${Date.now()}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold && id) {
      handlePrintID();
      setOpenCard(true);
      setHold(false);
    }
  }, [id, hold]);

  async function handleDownloadID() {
    try {
      const res = await fetch("/download-id", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.response);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `card_${id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
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
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white flex items-center p-4 filter drop-shadow-[0_0_0.25rem_#0097A7] z-10">
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
            <h1 className="text-2xl font-bold">List of Senior Citizens</h1>
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

        {/* SCROLLABLE  ADMIN LIST ACC CONTENT */}
        <main className="flex-1  overflow-auto p-5 bg-white">
          {/* <h3>List of Senior Citizens</h3> */}
          <div className="grid md:grid-cols-3 gap-2">
            <form onSubmit={handleFetchUsers}>
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
                    // className="block w-full ps-1"
                    type="text"
                    placeholder="Search by Email or Name"
                    value={emailOrFullname}
                    // onKeyDown={(e) => {
                    //   if (e.key === "Enter") {
                    //     e.preventDefault();
                    //   }}
                    // }
                    onChange={(e) => setEmailOrFullname(e.target.value)}
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
                className="w-full border rounded px-3 py-1.5"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value={"all"}>All</option>
                <option value={1}>Verified</option>
                <option value={0}>Unverified</option>
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

          {/* TABLE CONTAINER */}
          <div className="mt-6 overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Senior Citizen's Account List Table
            </h3>
            <div className="overflow-x-auto rounded-lg shadow-md ">
              <table className="min-w-[1400px] w-full border-collapse ">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3">Picture</th>
                    <th className="px-4 py-3">Signature</th>
                    <th className="px-4 py-3 text-left">Full Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">
                      Birthday
                      <div className="text-xs font-normal">MM/DD/YYYY</div>
                    </th>
                    <th className="px-4 py-3">Gender</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Emergency Contact</th>
                    <th className="px-4 py-3">Contact #</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y text-sm">
                  {users
                    .filter((user) =>
                      filter === "all"
                        ? user
                        : user.verify_status === Number(filter),
                    )
                    .map((user) => (
                      <tr key={user.senior_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{user.senior_id}</td>

                        <td className="px-4 py-3">
                          {pictures.map(
                            (picture) =>
                              picture.senior_id === user.senior_id && (
                                <img
                                  key={picture.picture_id}
                                  src={picture.picture_name}
                                  className="w-10 h-10 rounded-full object-cover border"
                                />
                              ),
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {signatures.map(
                            (signature) =>
                              signature.senior_id === user.senior_id && (
                                <img
                                  key={signature.signature_id}
                                  src={signature.image_name}
                                  className="w-10 h-10 object-contain border rounded"
                                />
                              ),
                          )}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {user.first_name} {user.middle_name} {user.last_name}
                        </td>

                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3 text-center">{user.age}</td>
                        <td className="px-4 py-3 text-center">
                          {user.birthday}
                        </td>
                        <td className="px-4 py-3 text-center">{user.gender}</td>

                        <td className="px-4 py-3 max-w-xs">
                          {user.house} {user.street},{" "}
                          {(user.subdivision && user.barangay) || user.barangay}
                          , {user.city}, {user.province}
                        </td>

                        <td className="px-4 py-3">
                          {user.emergency_fname} {user.emergency_mname}{" "}
                          {user.emergency_lname}
                        </td>

                        <td className="px-4 py-3">{user.emergency_number}</td>

                        <td className="px-4 py-3">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={verifications[user.senior_id]}
                            onChange={(e) =>
                              handleVerificationChange(
                                user.senior_id,
                                user.email,
                                e.target.value,
                              )
                            }
                          >
                            <option>Verified</option>
                            <option>Unverified</option>
                          </select>
                        </td>

                        <td className="px-4 py-3">{user.created_at}</td>
                        <td className="px-4 py-3">{user.updated_at}</td>

                        <td className="px-4 py-3 grid grid-cols-1 gap-2 justify-center">
                          <button
                            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => {
                              setUserInfo(
                                user.senior_id,
                                user.first_name,
                                user.middle_name,
                                user.last_name,
                                user.email,
                                user.age,
                                user.birthday,
                                user.gender,
                                user.house,
                                user.street,
                                user.subdivision,
                                user.barangay,
                                user.city,
                                user.province,
                                user.emergency_fname,
                                user.emergency_mname,
                                user.emergency_lname,
                                user.emergency_number,
                                true,
                              );
                              setOpenEdit(true);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            disabled={!user.verify_status}
                            className="px-3 py-1 text-xs rounded bg-emerald-600 text-white disabled:opacity-50"
                            onClick={() => {
                              setUserInfo(
                                user.senior_id,
                                user.first_name,
                                user.middle_name,
                                user.last_name,
                                user.email,
                                user.age,
                                user.birthday,
                                user.gender,
                                user.house,
                                user.street,
                                user.subdivision,
                                user.barangay,
                                user.city,
                                user.province,
                                user.emergency_fname,
                                user.emergency_mname,
                                user.emergency_lname,
                                user.emergency_number,
                                true,
                              );
                              setHold(true);
                            }}
                          >
                            Print ID
                          </button>

                          <button
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                              setID(user.senior_id);
                              setOpenDelete(true);
                            }}
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
              {!status && <p style={{ color: "red" }}>{response}</p>}

              <h3>User Edit</h3>
              <form onSubmit={handleEditUser}>
                <label>1x1 / Passport Size Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="id_picture"
                />
                <br />
                <small style={{ color: "red" }}>
                  {errors.id_picture_error}
                </small>
                <br />

                <label>Signature on white background</label>
                <input type="file" name="signature_picture" />
                <br />
                <small style={{ color: "red" }}>
                  {errors.signature_picture_error}
                </small>
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
                <small style={{ color: "red" }}>{errors.email_error}</small>
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
                <small style={{ color: "red" }}>
                  {errors.first_name_error}
                </small>
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
                <small style={{ color: "red" }}>
                  {errors.middle_name_error}
                </small>
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
                <small style={{ color: "red" }}>{errors.last_name_error}</small>
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
                <small style={{ color: "red" }}>
                  {errors.date_of_birth_error}
                </small>
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
                <small style={{ color: "red" }}>{errors.age_error}</small>
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
                <small style={{ color: "red" }}>{errors.gender_error}</small>
                <br />

                <label>Emergency Contact's First Name</label>
                <input
                  type="text"
                  name="emergency_fname"
                  value={emergencyFirstName}
                  onChange={(e) => setEmergencyFirstName(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>
                  {errors.emergency_first_name_error}
                </small>
                <br />

                <label>Emergency Contact's Middle Name</label>
                <input
                  type="text"
                  name="emergency_mname"
                  value={emergencyMiddleName}
                  onChange={(e) => setEmergencyMiddleName(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>
                  {errors.emergency_middle_name_error}
                </small>
                <br />

                <label>Emergency Contact's Last Name</label>
                <input
                  type="text"
                  name="emergency_lname"
                  value={emergencyLastName}
                  onChange={(e) => setEmergencyLastName(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>
                  {errors.emergency_last_name_error}
                </small>
                <br />

                <label>Emergency Contact's Contact Number</label>
                <input
                  type="tel"
                  name="emergency_number"
                  value={emergencyNumber}
                  onChange={(e) => setEmergencyNumber(e.target.value)}
                />
                <br />
                <small style={{ color: "red" }}>
                  {errors.emergency_number_error}
                </small>
                <br />

                <button onClick={(e) => fetchUser(e)}>Reset</button>
                <br />

                <button type="submit">Submit</button>
              </form>
              <button onClick={() => setOpenEdit(false)}>Cancel</button>
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
                    onSubmit={handleDeleteUser}
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
                        Are you sure you want to delete this Senior Citizen's
                        Account?
                      </p>
                      <p className="text-sm tracking-wider text-center font-semibold text-gray-500">
                        This action will delete this entire account, including
                        all saved data. This cannot be undone.
                      </p>
                    </div>

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
          {openCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              {/* <div className="bg-white rounded-xl border border-cyan-100 shadow-sm p-5"> */}
              <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative border-2 border-cyan-100 ">
                {/* Close button */}
                <button
                  onClick={() => setOpenCard(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                {/* Modal title */}
                <h3 className="text-lg font-semibold text-cyan-600 mb-1">
                  Senior Citizen's ID
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  To Print Senior Citizen's ID
                </p>

                {/* Senior Citizen's ID */}
                <div className="flex gap-2">
                  <div>
                    <label className="text-base font-semibold text-gray-600 mb-4">
                      Front
                    </label>

                    <img src={cardFront} width={"200px"}></img>
                  </div>

                  <div>
                    <label className="text-base font-semibold text-gray-600 mb-4">
                      Back
                    </label>

                    <img src={cardBack} width={"200px"}></img>
                  </div>
                </div>

                {/* buttons */}
                <div className="flex justify-between items-center gap-4 mt-4">
                  <button
                    className="px-6 md:px-8 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setOpenCard(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-10 md:px-12 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium"
                    onClick={() => {
                      handleDownloadID();
                    }}
                  >
                    Download ID
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* <button>
            <Link to="/superadmin-dashboard">Cancel</Link>
          </button> */}
        </main>
      </div>
    </div>
  );
}
