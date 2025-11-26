import { useState, useEffect } from "react";

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    async function getCsrfToken() {
      try {
        const res = await fetch("/csrf-token", {
          method: "GET",
          credentials: "include",
        })

        const data = await res.json();
        setCsrfToken(data.csrf_token);
      } catch (err) {
        console.error(err);
      }
    }

    getCsrfToken();
  }, [])

  return csrfToken;
}