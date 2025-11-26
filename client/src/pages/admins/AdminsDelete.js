import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken"

export default function AdminsDelete() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  useEffect(() => {
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

    getRole();
  }, [])

  async function handleDeleteAdminAccount(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/admins/delete", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json();
      setErrors({...data.errors});

      if (!data.success) {
        setStatus(data.status);
        setResponse(data.response);
      }
      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (data.status === 403) {
        navigate("/forbidden");
      }
      if (data.success) {
        navigate("/admins-login");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return(
    <div>
      <form onSubmit={handleDeleteAdminAccount}>
        { !status && (
          <p style={{color: "red"}}>{response}</p>
        )}

        <h3>Admins Delete Account</h3>
        <h3 style={{"color": "red"}}>Warning this will permanently delete your account</h3>
        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.password}</small>
        <br />

        <label>Confirm by entering password again</label>
        <input
          type="password"
          placeholder="password"
          name="confirm"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.confirm}</small>
        <br />

        <button type="submit">Delete Account</button>
      </form>

      <nav>
        { role === "superadmin" && (
          <button><Link to="/superadmin-dashboard">Cancel</Link></button>
        )}
        { role === "admin" && (
          <button><Link to="/admin-dashboard">Cancel</Link></button>
        )}
      </nav>
    </div>
  );
}