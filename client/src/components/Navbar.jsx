import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from 'react-icons/fa';

const Navbar = ({ setAuthOpen, setAuthType }) => {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className='flex items-center justify-between px-6 py-3 bg-white shadow-sm sticky top-0 z-50'>
                {/* logo */}
                <NavLink to="/" className='text-2xl font-bold text-blue-600'>Job Portal</NavLink>

                {/* navlinks */}
                <div className='hidden md:flex items-center gap-8'>
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>About</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Contact</NavLink>
                </div>

                {/* buttons */}
                <div className='hidden md:flex items-center gap-4'>

                    <button onClick={() => { setAuthType("login"); setAuthOpen(true) }} className='text-gray-600 hover:text-blue-600 font-medium'>Login</button>

                    <button onClick={() => { setAuthType("register"); setAuthOpen(true) }} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>Sign Up</button>

                </div>

                <button className="md:hidden flex flex-col justify-center items-center gap-1" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes size={22} /> : <GiHamburgerMenu size={22} />}
                </button>

            </div>

            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-white shadow-md border-1">
                    <NavLink to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/about" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>About</NavLink>
                    <NavLink to="/contact" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</NavLink>

                    <hr />

                    <button onClick={() => { setAuthType("login"); setAuthOpen(true); setMenuOpen(false); }} className="text-gray-600 text-center hover:text-blue-600 font-medium transition">Login</button>

                    <button onClick={() => { setAuthType("register"); setAuthOpen(true); setMenuOpen(false); }} className='bg-blue-600 text-white px-4 py-2 rounded-md text-center'>Sign Up</button>

                </div>
            )}
        </>
    )
}

export default Navbar
