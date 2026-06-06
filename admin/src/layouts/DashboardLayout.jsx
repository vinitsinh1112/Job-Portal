import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
        console.log("clicked");
    }

    return (
        <div className='min-h-screen flex'>

            {sidebarOpen && (
                <div onClick={toggleSidebar} className='fixed inset-0 bg-black/50 z-40 md:hidden'></div>
            )}

            <div className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-gray-700 bg-gray-800 text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:top-0 md:translate-x-0`}>
                <Sidebar toggleSidebar={toggleSidebar} />
            </div>

            <div className='flex-1 bg-gray-200 overflow-hidden'>
                <div className='h-16 border-b bg-white border-gray-200'>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                <main className='flex-1 p-4 overflow-x-hidden'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
