import "./App.css";
import { Routes, Route } from "react-router-dom";
import JobApplicationForm from "./components/Users/jobApplicationForm";
import Layout from "./components/Layouts/Layout";

// Toastify import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {/* Başvuru Sayfası */}
        <Route path="/" element={<Layout />}>
          <Route path="/JobApplicationForm" element={<JobApplicationForm />} />
        </Route>
      </Routes>

      {/* Toastify container (her yerde kullanılabilsin diye en alta koy) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
