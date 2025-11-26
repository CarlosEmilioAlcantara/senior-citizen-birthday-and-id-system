import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function SuperadminCreateAdmins() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleCreateAdmin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);
    try {
      const res = await fetch("/superadmin/create-admin", {
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
      if (data.status === 403) {
        navigate("/forbidden");
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

      <h3>Superadmin Create Admins</h3>
      <form onSubmit={handleCreateAdmin}>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          name="email"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.email}</small>
        <br/>

        <label>Username</label>
        <input
          type="text"
          placeholder="username"
          name="username"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.username}</small>
        <br/>

        <label>Role</label>
        <select name="role">
          <option>-- Please select a role --</option>
          <option value="admin">admin</option>
          <option value="superadmin">superadmin</option>
        </select>
        <br/>
        <small style={{"color": "red"}}>{errors.role}</small>
        <br/>

        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
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

        <button type="submit">Create Admin</button>
      </form>

      <button><Link to="/superadmin-dashboard">Cancel</Link></button>
    </div>
  );
}