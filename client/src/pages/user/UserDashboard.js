import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const [info, setInfo] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await fetch("/user/info", {
          method: "GET"
        })
        const data = await res.json();
        setInfo({...data.info});

        if (data.status === 429) {
          navigate("/too-many-requests");
        }
      } catch (err) {
        console.error(err);
      }
    }

    getUserInfo();
  }, [])

  useEffect(() => {
    async function getVerificationStatus() {
      try {
        const res = await fetch("/user/get-verification-status", {
          method: "GET",
        })
        const data = await res.json();
        if (!data.success) {
          alert(data.response);
        } else {
          setVerificationStatus(data.verification);
        }
      } catch (err) {
        console.error(err);
      }
    }

    getVerificationStatus();
  }, [])

  return (
    <div>
      <Sidebar/>
      { verificationStatus ? (
        <h3 style={{"color": "green"}}>You are verified</h3>
      ) : (
        <h3 style={{"color": "red"}}>You are still unverified</h3>
      )}

      <h3>User Dashboard</h3>
      <li>
        <h3>Senior Image</h3>
        <img width="150" src={`http://localhost:5000/${info.picture_name}`}></img>
        <h3>Senior Signature</h3>
        <img width="150" src={`http://localhost:5000/${info.image_name}`}></img>
        <h3>Fullname: { info.first_name } { info.middle_name } { info.last_name }</h3>
        <h3>Email: { info.email }</h3>
        <h3>Address: { info.address }</h3>
        <h3>Age: { info.age }</h3>
        <h3>Birthday: { info.birthday }</h3>
        <h3>Gender: { info.gender }</h3>
        <h3>Emergency Contact Name: { info.emergency_fname } { info.emergency_mname } { info.emergency_lname }</h3>
        <h3>Emergency Contact #: { info.emergency_number }</h3>
        <h3>Card Picture:</h3>
      </li>
    </div>
  );
}