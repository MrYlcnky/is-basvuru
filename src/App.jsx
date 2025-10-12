import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import JobApplicationForm from "./components/Users/jobApplicationForm";
import Layout from "./components/Layouts/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* default: /is-basvuru → /is-basvuru/JobApplicationForm */}
          <Route index element={<Navigate to="JobApplicationForm" replace />} />
          {/* DİKKAT: başında / YOK → nested path */}
          <Route path="JobApplicationForm" element={<JobApplicationForm />} />
          {/* yakalama */}
          <Route
            path="*"
            element={<Navigate to="JobApplicationForm" replace />}
          />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
