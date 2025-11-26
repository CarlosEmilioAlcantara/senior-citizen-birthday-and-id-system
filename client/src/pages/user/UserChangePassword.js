import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function UserChangePassword() {
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleChangePassword(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/user/change-password", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json();
      setErrors({...data.errors});

      if (data.status === 429) {
        navigate("/too-many-requests");
      }
      if (!data.success) {
        setStatus(data.success);
        setResponse(data.response);
      }
      if (data.success) {
        alert(data.response);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      { !status && (
        <p style={{color: "red"}}>{response}</p>
      )}

      <form onSubmit={handleChangePassword}>
        <h3>User Change Password</h3>
        <label>Old Password</label>
        <input
          type="password"
          placeholder="password"
          name="old_password"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.old_password}</small>
        <br />

        <label>New Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.password}</small>
        <br />

        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="password"
          name="confirm"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.confirm}</small>
        <br />

        <button type="submit">Change Password</button>
      </form>

      <nav>
        <button><Link to="/">Cancel</Link></button>
      </nav>
    </div>
  );
}