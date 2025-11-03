import "./App.css";
import { Routes, Route } from "react-router-dom";
import JobApplicationForm from "./components/Users/jobApplicationForm";
import AdminLayout from "./components/Layouts/AdminLayout/AdminLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Admin/Login/Login";
import AdminPanel from "./components/Admin/Panel/AdminPanel";

function App() {
  return (
    <>
      <Routes>
        {/* User */}
        <Route path="/" element={<JobApplicationForm />}>
          <Route path="JobApplicationForm" element={<JobApplicationForm />} />
        </Route>

        {/* Admin (Login'i Layout içinde göstermek) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Login />} /> {/* /admin  -> Login */}
          <Route path="login" element={<Login />} /> {/* /admin/login */}
          <Route path="panel" element={<AdminPanel />} /> {/* /admin/panel */}
        </Route>

        {/* İstersen ikinci layoutu kapat ya da ayrı test için bırak
        <Route path="/LAYOUT" element={<AdminLayout2 />}></Route> */}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
