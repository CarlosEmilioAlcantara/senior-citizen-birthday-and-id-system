import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function SuperadminDashboard() {
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getSuperadminInfo() {
      try {
        const res = await fetch("/admin/info", {
          method: "GET"
        })
        const data = await res.json();
        setInfo(prev => ({
          ...prev, ...data.info
        }));
        
        if (!data.success) {
          alert(data.response);
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

    getSuperadminInfo();
  }, [])

  useEffect(() => {
    async function getAdminsInfo() {
      try {
        const res = await fetch("/superadmin/dashboard", {
          method: "GET"
        })
        const data = await res.json();
        setInfo(prev => ({
          ...prev, ...data.info
        }));

        if (!data.success) {
          alert(data.response);
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

    getAdminsInfo();
  }, [])

  return(
    <div>
      <Sidebar/>
      <h3>Superadmin Dashboard</h3>
      <p>Hello {info.username}</p>
      <ul>
        <li>Email: {info.email}</li>
        <li>Role: {info.role}</li>
        <li>ID: {info.admin_id}</li>
      </ul>
      <ol>
        <li>Unverified Seniors: { info.unverified_seniors }</li>
        <li>Verified Seniors: { info.verified_seniors }</li>
        <li>Total Seniors: { info.senior_accounts }</li>
        <li>Total Admins: { info.admin_accounts }</li>
      </ol>
    </div>
  );
}