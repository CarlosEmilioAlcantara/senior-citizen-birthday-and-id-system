import { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [verifications, setVerifications] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [emailOrFullname, setEmailOrFullname] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [filter, setFilter] = useState("all");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null)
  const [response, setResponse] = useState("")
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function fetchUsers() {
    try {
      const res = await fetch(
        `/admins/users-list?page=${page}&per_page=${perPage}keyword=${emailOrFullname}&sort=${sort}`, 
        { method: "GET", }
      )
      const data = await res.json();
      const processedList = data.list.map(u => ({
        ...u,
        birthday: new Date(u.birthday).toLocaleDateString("en-US", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }));
      setUsers([...processedList]);
      setPictures([...data.pictures]);
      setSignatures([...data.signatures]);

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
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  useEffect(() => {
    setVerifications(
      Object.fromEntries(users.map(user => [
        user.senior_id, user.verify_status && "Verified" || "Unverified"
      ]))
    )
  }, [users])

  async function handleVerificationChange(id, verification) {
    setVerifications(prev => ({...prev, [id]: verification}));

    try {
      const res = await fetch("/admins/edit-senior-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({id, verification}),
      })
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
        alert(`Senior ${id}'s verification has changed`);
        window.location.reload(true);
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
    id, first_name, middle_name, last_name,
    email, age, birthday, gender, 
    house, street, subdivision, barangay, city, province,
    emergency_fname, emergency_mname, emergency_lname,
    emergency_number, edit=false
  ) => {
    
    if (edit) {
      const [month, day, year] = birthday.split("/");
      const isoDate = `${year}-${month}-${day}`;
      setBirthday(isoDate);
    } else {
      setBirthday(birthday);
    }

    setID(id)
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
  }

  function handleSetAge() {
    const date = new Date();
    const yearNow = date.getFullYear();
    const monthNow = date.getMonth();
    const dayNow = date.getDate();

    const yearThen = new Date(birthday).getFullYear();
    const monthThen = new Date(birthday).getMonth();
    const dayThen = new Date(birthday).getDate();

    if (monthNow < monthThen || ( monthNow === monthThen && dayNow <= dayThen)) {
      setAge(yearNow - yearThen - 1)
    } else {
      setAge(yearNow - yearThen)
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
      })
      const data = await res.json();
      setStatus(data.success);
      setResponse(data.response);
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        alert(`Senior ${id} edited`);
        window.location.reload(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteUser(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.append("id", id)
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/admins/delete-senior", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
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
        window.location.reload(true);
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
      })
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
        setOpenCard(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDownloadID() {
    try {
      const res = await fetch("/download-id", {
        method: "POST",
        credentials: 'include',
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ 
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
        }),
      })
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

  return(
    <div>
      <div>
        <h3>List of Senior Citizens</h3>
        <div style={{"display": "flex", "alignItems": "center", "gap": "1em"}}>
          <form onSubmit={handleFetchUsers}>
            <input 
              type="text" 
              placeholder="Search by email/full name"
              value={emailOrFullname}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     e.preventDefault();
              //   }}
              // }
              onChange={(e) => setEmailOrFullname(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div>
            <p>Filter By</p>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value={"all"}>All</option>
              <option value={1} >Verified</option>
              <option value={0} >Unverified</option>
            </select>
          </div>

          <div>
            <p>Sort By</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value={"Newest"}>Newest to Oldest</option>
              <option value={"Oldest"}>Oldest to Newest</option>
              <option value={"Updated"}>Last Updated</option>
              <option value={"Unupdated"}>Last Unupdated</option>
            </select>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Picture</th>
            <th>Signature</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Birthday<br/><small>mm/dd/yyyy</small></th>
            <th>Gender</th>
            <th>Address</th>
            <th>Emergency Contact Name</th>
            <th>Emergency Contact #</th>
            <th>Verification Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users
          // .filter(user => {
          //   if (emailOrFullname === "") return user
          //   const q = emailOrFullname.toLowerCase();

          //   return (
          //     user.first_name.toLowerCase().includes(q) || 
          //     user.middle_name.toLowerCase().includes(q) || 
          //     user.last_name.toLowerCase().includes(q)
          //   )
          // })
          .filter(user => {
            return filter === "all" ? user :
            user.verify_status === Number(filter)
          })
          .map((user) => (
            <tr key={user.senior_id}>
              {user.verify_status === filter && (<p>Yes</p>)}
              <td>{user.senior_id}</td>

              <td>
                {pictures.map((picture) => (
                  picture.senior_id === user.senior_id && (
                    <img id={picture.picture_id} src={picture.picture_name} width={"50px"}></img>
                  )
                ))}
              </td>

              <td>
                {signatures.map((signature) => (
                  signature.senior_id === user.senior_id && (
                    <img id={signature.signature_id} src={signature.image_name} width={"50px"}></img>
                  )
                ))}
              </td>

              {/* <td>
                {(() => {
                  const userCards = cards.filter(
                    card => String(card.senior_id) === String(user.senior_id)
                  );

                  return userCards.length > 0 ? (
                    userCards.map(card => (
                      <div key={card.card_id}>
                        <img src={card.card_front_name} width="50" alt="Card front" />
                        <img src={card.card_back_name} width="50" alt="Card back" />
                      </div>
                    ))
                  ) : (
                    <p>Verify first and print ID</p>
                  );
                })()}
              </td> */}

              <td>{user.first_name} {user.middle_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.birthday}</td>
              <td>{user.gender}</td>
              <td>
                {user.house} {user.street}, {user.subdivision && user.barangay 
                || user.barangay}, {user.city}, {user.province}
              </td>
              <td>{user.emergency_fname} {user.emergency_mname} {user.emergency_lname}</td>
              <td>{user.emergency_number}</td>

              <td>
                <select 
                  value={verifications[user.senior_id]}
                  onChange={(e) => handleVerificationChange(
                    user.senior_id, e.target.value)}
                >
                  <option>Verified</option>
                  <option>Unverified</option>
                </select>
              </td>

              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>

              <td>
                <button onClick={() => {
                  setUserInfo(
                    user.senior_id, user.first_name, user.middle_name, 
                    user.last_name, user.email, user.age, user.birthday, 
                    user.gender, user.house, user.street, user.subdivision, 
                    user.barangay, user.city, user.province, 
                    user.emergency_fname, user.emergency_mname, 
                    user.emergency_lname, user.emergency_number, true
                  ); 
                  setOpenDelete(false); setOpenCard(false); setOpenEdit(true);
                }}>
                  Edit
                </button>

                <button 
                  disabled={!user.verify_status}
                  onClick={() => {
                    setUserInfo(
                      user.senior_id, user.first_name, user.middle_name, 
                      user.last_name, user.email, user.age, user.birthday, 
                      user.gender, user.house, user.street, user.subdivision, 
                      user.barangay, user.city, user.province, 
                      user.emergency_fname, user.emergency_mname, 
                      user.emergency_lname, user.emergency_number, true
                  ); 
                  setOpenDelete(false); setOpenEdit(false); handlePrintID();
                }}>
                  Print ID
                </button>

                <button onClick={() => {
                  setUserInfo(user.senior_id);
                  setOpenCard(false);
                  setOpenEdit(false);
                  setOpenDelete(true);}}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { openEdit && (
        <div className="popup">
          { !status && (
            <p style={{color: "red"}}>{response}</p>
          )}

          <h3>User Edit</h3>
          <form onSubmit={handleEditUser}>
            <label>1x1 / Passport Size Image</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg"
              name="id_picture"
            />
            <br/>
            <small style={{"color": "red"}}>{errors.id_picture_error}</small>
            <br/>

            <label>Signature on white background</label>
            <input 
              type="file" 
              name="signature_picture"
            />
            <br/>
            <small style={{"color": "red"}}>{errors.signature_picture_error}</small>
            <br/>

            <label>Email</label>
            <input 
              type="email" 
              placeholder="Email..."
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.email_error}</small>
            <br/>

            <label>First Name</label>
            <input 
              type="text" 
              placeholder="First name..."
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.first_name_error}</small>
            <br/>

            <label>Middle Name</label>
            <input 
              type="text" 
              placeholder="Middle name..."
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.middle_name_error}</small>
            <br/>

            <label>Last Name</label>
            <input 
              type="text" 
              placeholder="Last name..."
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.last_name_error}</small>
            <br/>

            <label>Address</label>
            <br/>
            <label>House No. / Building / Lot No. *</label>
            <input 
              type="text"
              placeholder="144"
              name="house"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.house}</small>
            <br/>

            <label>Street *</label>
            <input 
              type="text"
              placeholder="Bayabas St."
              name="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.street}</small>
            <br/>

            <label>Subdivision</label>
            <input 
              type="text"
              placeholder="Sayote Village"
              name="subdivision"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.subdivision}</small>
            <br/>

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
            <br/>
            <small style={{"color": "red"}}>{errors.barangay}</small>
            <br/>

            <label>City / Municipality</label>
            <input 
              type="text"
              placeholder="San Juan"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled
            />
            <br/>
            <small style={{"color": "red"}}>{errors.city}</small>
            <br/>

            <label>Province</label>
            <input 
              type="text"
              placeholder="Metro Manila"
              name="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              disabled
            />
            <br/>
            <small style={{"color": "red"}}>{errors.province}</small>
            <br/>

            <label>Date of Birth</label>
            <input 
              type="date" 
              name="birthday"
              value={birthday}
              onChange={(e) => {setBirthday(e.target.value); handleSetAge()}}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.date_of_birth_error}</small>
            <br/>

            <label>Age</label>
            <input 
              type="number" 
              min="0"
              max="150"
              name="age"
              value={age}
              disabled
            />
            <br/>
            <small style={{"color": "red"}}>{errors.age_error}</small>
            <br/>

            <label>Gender</label>
            <select name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option>-- Please select an option --</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <br/>
            <small style={{"color": "red"}}>{errors.gender_error}</small>
            <br/>

            <label>Emergency Contact's First Name</label>
            <input 
              type="text" 
              name="emergency_fname"
              value={emergencyFirstName}
              onChange={(e) => setEmergencyFirstName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.emergency_first_name_error}</small>
            <br/>

            <label>Emergency Contact's Middle Name</label>
            <input 
              type="text" 
              name="emergency_mname"
              value={emergencyMiddleName}
              onChange={(e) => setEmergencyMiddleName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.emergency_middle_name_error}</small>
            <br/>

            <label>Emergency Contact's Last Name</label>
            <input 
              type="text" 
              name="emergency_lname"
              value={emergencyLastName}
              onChange={(e) => setEmergencyLastName(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.emergency_last_name_error}</small>
            <br/>

            <label>Emergency Contact's Contact Number</label>
            <input 
              type="tel" 
              name="emergency_number"
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.emergency_number_error}</small>
            <br/>

            <button type="submit">Submit</button>
          </form>
          <button onClick={() => setOpenEdit(false)}>Cancel</button>
        </div>
      )}

      { openDelete && (
        <div className="popup">
          <form onSubmit={handleDeleteUser}>
            <p style={{"color": "red"}}>
              This will permanently delete senior #{id}, are you sure?
            </p>
            <button type="submit">Confirm</button>
          </form>
          <button onClick={() => setOpenDelete(false)}>Cancel</button>
        </div>
      )}

      { openCard && (
        <div className="popup">
          <label>Front</label>
          <br/>
          <img src="./temp/card-front.png" width={"200px"}></img>

          <br/>

          <label>Back</label>
          <br/>
          <img src="./temp/card-back.png" width={"200px"}></img>

          <br/>
          <button onClick={() => {handleDownloadID();}}>Download ID</button>
          <button onClick={() => setOpenCard(false)}>Close</button>
        </div>
      )}

      <button><Link to="/superadmin-dashboard">Go back</Link></button>
    </div>
  );
}