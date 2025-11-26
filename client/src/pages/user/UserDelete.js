import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCsrfToken from "../CsrfToken";

export default function UserDelete() {
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const csrfToken = useCsrfToken();
  const navigate = useNavigate();

  async function handleDeleteAccount(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("csrf_token", csrfToken);

    try {
      const res = await fetch("/user/delete-account", {
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
        navigate("/user-login");
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

      <form onSubmit={handleDeleteAccount}>
        <h3>User Delete Account</h3>
        <h3 style={{"color": "red"}}>Warning this will permanently delete your account</h3>
        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.password}</small>
        <br />

        <label>Confirm by entering password again</label>
        <input
          type="password"
          placeholder="password"
          name="confirm"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.confirm}</small>
        <br />

        <button type="submit">Delete Account</button>
      </form>

      <nav>
        <button><Link to="/">Cancel</Link></button>
      </nav>
    </div>
  );
}