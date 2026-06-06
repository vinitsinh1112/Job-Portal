import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBriefcase, FaClipboardList, FaUserCircle, FaTimes, FaPlusCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { IoBookmarksSharp } from "react-icons/io5";

const MainLayout = () => {

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='flex h-screen'>

            {/* SIDEBAR */}
            <div className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-gray-800 text-white flex flex-col gap-4 px-5 py-6 transform transition-transform duration-300 z-50 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

                <button
                    className='md:hidden mb-4 text-right'
                    onClick={() => setSidebarOpen(false)}
                >
                    <FaTimes />
                </button>

                <p className='text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4'>Navigation</p>

                <nav className='flex flex-col gap-3 text-lg mt-6'>

                    {user?.role === "user" && (
                        <>
                            <NavLink to="/dashboard" end className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaHome /> Home
                            </NavLink>

                            <NavLink to="/dashboard/jobs" className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaBriefcase /> Jobs
                            </NavLink>

                            <NavLink to="/dashboard/applications" className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaClipboardList /> Applications
                            </NavLink>

                            <NavLink to="/dashboard/savedJobs" className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <IoBookmarksSharp /> Saved Jobs
                            </NavLink>
                        </>
                    )}

                    {user?.role === "recruiter" && (
                        <>
                            <NavLink to="/dashboard" end className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaHome /> Home
                            </NavLink>

                            <NavLink to="/dashboard/myjobs" className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaBriefcase /> My Jobs
                            </NavLink>

                            <NavLink to="/dashboard/create-jobs" className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`
                            }>
                                <FaPlusCircle /> Create Job
                            </NavLink>
                        </>
                    )}

                </nav>
            </div>

            {/* Right side */}
            <div className='flex-1 flex flex-col'>

                {/* Navbar */}
                <div className='h-16 bg-white border-b flex items-center px-4 md:px-6'>

                    {/* Left */}
                    <div className='flex items-center gap-3'>
                        <button
                            className='md:hidden text-2xl'
                            onClick={() => setSidebarOpen(true)}
                        >
                            <GiHamburgerMenu />
                        </button>

                        <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-blue-600 truncate max-w-[140px] sm:max-w-none'>Job Portal</h1>
                    </div>

                    {/* Right side */}
                    <div className='relative ml-auto' ref={dropdownRef}>

                        <div className='flex items-center gap-2 cursor-pointer max-w-[150px] sm:max-w-[200px]' onClick={() => setOpen(!open)}>
                            <FaUserCircle className='text-gray-600 flex-shrink-0' size={32} />

                            <div className='flex flex-col overflow-hidden'>
                                <span className='text-sm font-medium text-gray-700 truncate'>
                                    {user?.name}
                                </span>
                                <span className='text-[10px] sm:text-xs text-gray-500 truncate'>
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {/* DROPDOWN */}
                        {open && (
                            <div className='absolute right-0 mt-3 w-40 bg-white border rounded-md shadow-md z-50'>
                                <NavLink
                                    to="profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Profile
                                </NavLink>

                                <button
                                    onClick={() => {
                                        logout();
                                        toast.success("Logged out successfully");
                                        navigate("/");
                                    }}
                                    className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500'
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div
                    className='flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-200'
                    onClick={() => setSidebarOpen(false)}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;