import { Link } from "react-router-dom";

export default function RateLimitExceeded() {
  return(
    <div>
      <h1>You have exceeded the amount of requests allowed for this route</h1>
      <nav><Link to="/login">Return to Login</Link></nav>
    </div>
  );
}