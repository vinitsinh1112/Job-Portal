import { Routes, Route, useLocation } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home"
import Jobs from "./pages/Jobs.jsx"
import JobDetails from "./pages/JobDetails.jsx"
import Profile from "./pages/Profile.jsx"
import MainLayout from "./layouts/MainLayout.jsx"
import Applications from "./pages/Applications.jsx"
import Landing from "./pages/Landing.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import AuthModal from "./components/modals/userModal/AuthModal.jsx"
import { useState } from "react"
import Navbar from "./components/Navbar.jsx"
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import Applicants from "./pages/Applicants.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import CreateJobs from "./pages/CreateJobs.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import { useAuth } from "./context/authContext.jsx";
import GlobalModal from "./components/modals/GlobalModal.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import './index.css'

function App() {

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const { user } = useAuth();


  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="light"
        toastClassName="!shadow-lg !px-4 !py-3 !backdrop-blur-md"
        bodyClassName="!text-sm sm:!text-base !font-medium"
      />


      {!isDashboardPage && (
        <Navbar setAuthOpen={setAuthOpen} setAuthType={setAuthType} />
      )}

      <Routes>

        <Route path="/" element={<Landing setAuthOpen={setAuthOpen} setAuthType={setAuthType} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/dashboard"
          element={
            <ProtectedRoute><MainLayout /></ProtectedRoute>
          }
        >
          <Route index element={user?.role === "recruiter" ? <RecruiterDashboard /> : <Home />} />
          <Route path="/dashboard/jobs" element={<Jobs />} />
          <Route path="/dashboard/jobs/:id" element={<JobDetails />} />
          <Route path="/dashboard/applications" element={<Applications />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/savedJobs" element={<SavedJobs />} />
          <Route path="/dashboard/jobs/:jobId/applicants" element={<RoleRoute allowedRole="recruiter"><Applicants /></RoleRoute>} />
          <Route path="/dashboard/applicants" element={<RoleRoute allowedRole="recruiter"><Applicants /></RoleRoute>} />
          <Route path="/dashboard/myJobs" element={<RoleRoute allowedRole="recruiter"><MyJobs /></RoleRoute>} />
          <Route path="/dashboard/create-jobs" element={<RoleRoute allowedRole="recruiter"><CreateJobs /></RoleRoute>} />
        </Route>

      </Routes>

      <GlobalModal />
      <AuthModal authOpen={authOpen} setAuthOpen={setAuthOpen} authType={authType} />
    </>
  )
}

export default App
