import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function AdminsEdit() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [info, setInfo] = useState({});
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function getAdminInfo() {
    try {
      const res = await fetch("/admin/info", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json();
      setInfo({...data.info});

      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getRole() {
    try {
      const res = await fetch("/auth/get-role", {
        method: "GET",
        credentials: "include",
      }) 
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setEmail(info.email);
    setUsername(info.username);
  }, [info])

  useEffect(() => {
    getRole();
    getAdminInfo()
  }, [])

  async function handleAdminEdit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken)

    try {
      const res = await fetch("/admins/edit", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json();
      setErrors({...data.errors});

      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.success) {
        navigate("/superadmin-dashboard");
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return(
    <div>
      { !status && (
        <p style={{color: "red"}}>{response}</p>
      )}

      <h3>Superadmin Edit Account</h3>
      <form onSubmit={handleAdminEdit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          name="email"
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
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br/>
        <small style={{"color": "red"}}>{errors.username}</small>
        <br/>

        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small>Leave empty to not change</small>
        <small style={{"color": "red"}}>{errors.password}</small>
        <br/>

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="confirm password"
          name="confirm"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.confirm}</small>
        <br/>

        <button type="submit">Edit Account</button>
      </form>

      { role === "admin" && (
        <button><Link to="/admin-dashboard">Cancel</Link></button>
      )}
      { role === "superadmin" && (
        <button><Link to="/superadmin-dashboard">Cancel</Link></button>
      )}
    </div>
  );
}