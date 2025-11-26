import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    try {
      const res = await fetch("/login", {
        method: "POST",
        body: fd,
      })

      const data = await res.json();
      setErrors({...data.errors});
      setStatus(data.success);
      setResponse(data.response);

      if (data.status === 429) {
        navigate("/too-many-requests");
      } 

      if (res.ok && data.success) { 
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      { !status && (
        <p style={{color: "red"}}>{response}</p>
      )}

      <form onSubmit={handleLogin}>
        <h3>User Login</h3>
        <label>Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          name="email"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.email }</small>
        <br/>

        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          name="password"
        />
        <br/>
        <small style={{"color": "red"}}>{ errors.password }</small>
        <br />

        {/* <input type="hidden" name="csrf_token" value={csrfToken}></input> */}
        <button type="submit">Login</button>
      </form>

      <nav>
        <Link to="/user-register">Register</Link>
      </nav>
    </div>
  );
}