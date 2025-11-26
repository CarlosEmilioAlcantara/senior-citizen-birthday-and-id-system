import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function SuperadminAdminsList() {
  const [admins, setAdmins] = useState([]);
  const [getAll, setGetAll] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [roles, setRoles] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setAdminID] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("all");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function getAdminsInfo() {
      try {
        const res = await fetch("/admin/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            getAll,
          }),
        })
        const data = await res.json();
        setAdmins([...data.info]);

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
  }, [csrfToken])

  useEffect(() => {
    async function getSuperadminID() {
      try {
        const res = await fetch("/superadmin/get-superadmin-id", {
          method: "GET"
        })
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
  }, [])

  useEffect(() => {
    setRoles(
      Object.fromEntries(admins.map(admin => [
        admin.admin_id, admin.role
      ]))
    )
  }, [admins])

  async function changeRole(id, role) {
    const res = await fetch("/superadmin/edit-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({id, role}),
    })
    return res.json();
  }

  const handleChangeRole = async (id, role) => {
    setRoles(prev => ({...prev, [id]: role}));

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
        setAdmins([...data.admins])
      }
    } catch (err) {
      console.error(err);
    }
  }

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
          id, email, username
        }),
      })
      const data = await res.json();
      setErrors({...data.errors});

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
        window.location.reload(true);
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
  }
  
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
          id
        }),
      })
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
        window.location.reload(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const deleteAdmin = (id) => {
    setOpenEdit(false);
    setOpenDelete(true);
    setAdminID(id);
  }

  return(
    <div>
      <div>
        <h3>List of admin accounts</h3>
        <div>
          <div style={{"display": "flex", "alignItems": "center", "gap": "1em"}}>
            <form>
              <input 
                type="text" 
                placeholder="Search by username/email"
                value={emailOrUsername}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }}
                }
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </form>

            <div>
              <p>Filter By</p>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value={"all"}>All</option>
                <option value={"admin"} >admin</option>
                <option value={"superadmin"} >superadmin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins
          .filter(admin => admin.admin_id !== currentAdmin)
          .filter(admin => {
            return emailOrUsername === "" ? admin : 
            admin.username.includes(emailOrUsername.toLowerCase()) ||
            admin.email.includes(emailOrUsername.toLowerCase())
          })
          .filter(admin => {
            return filter === "all" ? 
            admin : admin.role === filter
          })
          .map((admin) => (
            <tr key={admin.admin_id}>
              <td>{admin.admin_id}</td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>
                <select 
                  value={roles[admin.admin_id]}
                  onChange={(e) => handleChangeRole(admin.admin_id, e.target.value)}
                >
                  <option>admin</option>
                  <option>superadmin</option>
                </select>
              </td>
              <td>
                <button onClick={() => editAdmin(
                  admin.admin_id,
                  admin.email,
                  admin.username
                )}>
                  Edit
                </button>
                <button onClick={() => deleteAdmin(admin.admin_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      { openEdit && (
        <div className="popup">
          <form onSubmit={handleEditAdmin}>
            { !status && (
              <p style={{color: "red"}}>{response}</p>
            )}

            <label>Editing Admin {id}</label>
            <br/>
            <label>Email</label>
            <input
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.email}</small>
            <br/>

            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <small style={{"color": "red"}}>{errors.username}</small>
            <br/>

            <button type="submit">Edit Admin</button>
          </form>

          <button onClick={() => {
            setOpenEdit(false); 
            setErrors({});
            setResponse("");
          }}>
            Cancel</button>
        </div>
      )}

      { openDelete && (
        <div className="popup">
          <form onSubmit={handleDeleteAdmin}>
            <label>Delete Confirmation for Admin {id}</label>
            <br/>
            <p>Are you sure you want to delete this admin?</p>

            <button type="submit">Delete Admin</button>
          </form>

          <button onClick={() => setOpenDelete(false)}>Cancel</button>
        </div>
      )}

      <button><Link to="/superadmin-dashboard">Go back</Link></button>
    </div>
  );
}