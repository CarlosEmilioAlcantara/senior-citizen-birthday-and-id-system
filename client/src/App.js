import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import RateLimitExceeded from "./pages/RateLimitExceeded";
import Forbidden from "./pages/Forbidden";
import Unauthorized from "./pages/Unauthorized";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import ForgotPassword from "./pages/reset/ForgotPassword";
import UsersForgotPassword from "./pages/reset/UsersForgotPassword";
import AdminsForgotPassword from "./pages/reset/AdminsForgotPassword";
import UserDashboard from "./pages/user/UserDashboard";
import UserEdit from "./pages/user/UserEdit";
import UserChangePassword from "./pages/user/UserChangePassword";
import UserDelete from "./pages/user/UserDelete";
import AdminsLogin from "./pages/admins/AdminsLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import SuperadminCreateAdmins from "./pages/superadmin/SuperadminCreateAdmins";
import SuperadminAdminsList from "./pages/superadmin/SuperadminAdminsList";
import AdminsEdit from "./pages/admins/AdminsEdit";
import AdminsDelete from "./pages/admins/AdminsDelete";
import UsersList from "./pages/admins/UsersList";
import Logout from "./pages/Logout";

import Test from "./Test"; // ← tailwind test component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TAILWIND TEST ROUTE */}
        <Route path="/test" element={<Test />} />

        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admins-login" element={<AdminsLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user-reset-password" element={<UsersForgotPassword />} />
        <Route path="/admin-reset-password" element={<AdminsForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/too-many-requests" element={<RateLimitExceeded />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/unauthorized" element={<Forbidden />} />

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/user-edit" element={<UserEdit />} />
          <Route
            path="/user-change-password"
            element={<UserChangePassword />}
          />
          <Route path="/user-delete" element={<UserDelete />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={["admin", "superadmin"]} />}
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admins-edit" element={<AdminsEdit />} />
          <Route path="/admins-delete" element={<AdminsDelete />} />
          <Route path="/users-list" element={<UsersList />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route
            path="/superadmin-dashboard"
            element={<SuperadminDashboard />}
          />
          <Route path="/admins-edit" element={<AdminsEdit />} />
          <Route
            path="/superadmin-create-admins"
            element={<SuperadminCreateAdmins />}
          />
          <Route path="/admins-list" element={<SuperadminAdminsList />} />
          <Route path="/admins-delete" element={<AdminsDelete />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
