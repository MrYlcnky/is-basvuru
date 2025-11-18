import "./App.css";
import { Routes, Route } from "react-router-dom";
import JobApplicationForm from "./components/Users/JobApplicationForm";
<<<<<<< HEAD
=======
import Layout from "./components/Layouts/UserLayout/Layout";
>>>>>>> 49136a9db111245786e600133a7e912ed85c3f53
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
<<<<<<< HEAD

        <Route path="JobApplicationForm" element={<JobApplicationForm />} />
=======
        <Route path="/" element={<Layout />}>
          <Route path="JobApplicationForm" element={<JobApplicationForm />} />
        </Route>
>>>>>>> 49136a9db111245786e600133a7e912ed85c3f53

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
