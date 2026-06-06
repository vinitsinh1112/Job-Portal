import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { IoMdClose } from "react-icons/io";
import { FiGrid, FiUsers, FiBriefcase, FiFileText, FiLogOut } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ toggleSidebar }) => {

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const getNavLinkClass = ({ isActive }) => {
        return isActive
            ? "flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-lg bg-blue-600 w-full"
            : "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 text-lg w-full transition-colors duration-200";
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        toast.success("Logged out successfully");

        navigate("/login");
    }

    return (
        <div className='flex flex-col gap-5 w-full h-full p-4'>
            <div className='flex items-center justify-between pb-4 mb-4 border-b'>
                <h1 className='font-bold text-lg'>Job Portal</h1>
                <button onClick={toggleSidebar} className='md:hidden'><IoMdClose size={24} /></button>
            </div>

            <div className='flex flex-col gap-3'>
                <NavLink to="/" className={getNavLinkClass} onClick={toggleSidebar}>
                    <FiGrid /> <span>Dashboard</span>
                </NavLink>

                <NavLink to="/users" className={getNavLinkClass} onClick={toggleSidebar}>
                    <FiUsers /> <span>Users</span>
                </NavLink>

                <NavLink to="/jobs" className={getNavLinkClass} onClick={toggleSidebar}>
                    <FiBriefcase /> <span>Jobs</span>
                </NavLink>

                <NavLink to="/applications" className={getNavLinkClass} onClick={toggleSidebar}>
                    <FiFileText /> <span>Applications</span>
                </NavLink>

            </div>

            <div className='mt-auto'>
                <button onClick={handleLogout} className='flex items-center gap-2 w-full px-3 py-2 rounded-lg text-lg hover:bg-red-600 transition-colors duration-200'><FiLogOut /> Logout</button>
            </div>
        </div>
    )
}

export default Sidebar
