import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import UserDetails from './pages/users/UserDetails';
import Jobs from './pages/jobs/Jobs';
import JobDetails from './pages/jobs/JobDetails';
import Applications from './pages/applications/Applications';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <>
      <Toaster position='top-center' />
      <Routes>

        <Route path='/login' element={<Login />} />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Dashboard />} />
          <Route path='users' element={<Users />} />
          <Route path='users/:id' element={<UserDetails />} />
          <Route path='jobs' element={<Jobs />} />
          <Route path='jobs/:id' element={<JobDetails />} />
          <Route path='applications' element={<Applications />} />

        </Route>

      </Routes >
    </>
  )
}

export default App
