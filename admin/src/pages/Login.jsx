import React, { useState } from 'react'
import toast from "react-hot-toast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


const Login = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${backendUrl}/api/auth/admin/login`,
                {
                    email,
                    password,
                }
            );

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);

                toast.success("Login successfull");
                navigate("/");
            }

        } catch (error) {
            console.log(error.response?.data?.message);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-200 px-4'>
            <div className='w-full max-w-sm bg-white rounded-xl shadow-md p-6'>
                <div className='text-center mb-6'>
                    <h1 className='text-2xl font-bold'>Admin Login</h1>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <div className='relative'>
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                        </div>
                    </div>

                    <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50'>{loading ? "Logging in..." : "Login"}</button>

                </form>

            </div>
        </div>
    )
}

export default Login
