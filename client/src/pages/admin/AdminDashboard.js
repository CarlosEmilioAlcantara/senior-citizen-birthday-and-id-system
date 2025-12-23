import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function AdminDashboard() {
  const [info, setInfo] = useState({});
  const [celebrants, setCelebrants] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAdminInfo() {
      try {
        const res = await fetch("/admins/info", {
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

    getAdminInfo();
  }, [])

  useEffect(() => {
    async function getAdminsInfo() {
      try {
        const res = await fetch("/admin/dashboard", {
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

  useEffect(() => {
    async function getCelebrants() {
      try {
        const res = await fetch("/admins/get-celebrants", {
          method: "GET"
        })
        const data = await res.json();
        const processedList = data.celebrants.map(u => ({
          ...u,
          birthday: new Date(u.birthday).toLocaleDateString("en-US", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }));
        setCelebrants(processedList);
        setPictures(data.pictures);
        setSignatures(data.signatures);

        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getCelebrants();
  }, [])

  return(
    <div>
      <Sidebar/>
      <h3>Admin Dashboard</h3>
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
      </ol>

      <h3>Seniors with birthdays</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Picture</th>
            <th>Signature</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Birthday<br/><small>mm/dd/yyyy</small></th>
          </tr>
        </thead>

        <tbody>
          {celebrants.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No Celebrants Today
              </td>
            </tr>
          ) : (
            celebrants.map((celebrant) => (
              <tr key={celebrant.senior_id}>
                <td>{celebrant.senior_id}</td>

                <td>
                  {pictures.map((picture) => (
                    picture.senior_id === celebrant.senior_id && (
                      <img id={picture.picture_id} src={picture.picture_name} width={"50px"}></img>
                    )
                  ))}
                </td>

                <td>
                  {signatures.map((signature) => (
                    signature.senior_id === celebrant.senior_id && (
                      <img id={signature.signature_id} src={signature.image_name} width={"50px"}></img>
                    )
                  ))}
                </td>

                <td>
                  {celebrant.first_name} 
                  {celebrant.middle_name} 
                  {celebrant.last_name}
                </td>

                <td>{celebrant.email}</td>
                <td>{celebrant.age}</td>
                <td>{celebrant.birthday}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}