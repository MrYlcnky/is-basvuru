import "./App.css";
import { Routes, Route } from "react-router-dom";
import JobApplicationForm from "./components/Users/JobApplicationForm";
import Layout from "./components/Layouts/UserLayout/Layout";
import AdminLayout from "./components/Layouts/AdminLayout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Admin/Login/Login";
import AdminPanel from "./components/Admin/Panel/AdminPanel";

function App() {
  return (
    <>
      <Routes>
        {/* User */}
        <Route path="/" element={<Layout />}>
          <Route path="JobApplicationForm" element={<JobApplicationForm />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin (korumalı) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="panel" element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
