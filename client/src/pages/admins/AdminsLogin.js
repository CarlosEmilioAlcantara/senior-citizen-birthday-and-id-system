import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminsLogin() {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const res = await fetch("/auth/admin-login", {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      
      const data = await res.json();
      setErrors({...data.errors});
      setStatus(data.success);
      setResponse(data.response);

      if (data.status === 429) {
        navigate("/too-many-requests");
      } 
      
      if (data.success && data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.success && data.role === "superadmin") {
        navigate("/superadmin-dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      { !status && (
        <p style={{color: "red"}}>{response}</p>
      )}

      <form onSubmit={handleLogin}>
        <h3>Admin Login</h3>
        <label>Email/Username</label>
        <input
          type="text"
          placeholder="email@email.com"
          name="email_or_username"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.email_or_username}</small>
        <br/>

        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small style={{"color": "red"}}>{errors.password}</small>
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}