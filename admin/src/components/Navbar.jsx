import React from 'react'
import { IoMenuOutline } from "react-icons/io5";

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className='h-full flex justify-between items-center px-4 gap-3'>
            <div className='flex items-center gap-3 min-w-0'>
                <button onClick={toggleSidebar} className='block md:hidden flex-shrink-0'><IoMenuOutline size={24} /></button>
                <h1 className='font-semibold text-sm sm:text-lg truncate'>Job Portal Admin</h1>
            </div>
            <div className='text-sm sm:text-base whitespace-nowrap'>Hello, Admin</div>
        </nav>
    )
}

export default Navbar
