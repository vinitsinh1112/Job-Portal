import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../../../context/authContext";
import { FaTimes } from 'react-icons/fa';

const AuthModal = ({ authOpen, setAuthOpen, authType }) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [mode, setMode] = useState(authType);
    const modalRef = useRef();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);


    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        const backendUrl =
            mode === "login"
                ? `${backendURL}/api/auth/login`
                : `${backendURL}/api/auth/register`;

        try {
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (mode === "login") {
                login(data.user, data.token);
                toast.success("Logged in successfully");
                setAuthOpen(false);
                navigate("/dashboard");
            } else {
                toast.success("Registered successfully");
                setMode("login");
            }

        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: ""
        });
    }, [authOpen]);

    useEffect(() => {
        setMode(authType);
    }, [authType]);

    useEffect(() => {
        if (authOpen) {
            setMounted(true);
            setShow(false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setShow(true);
                });
            });
        } else {
            setShow(false);

            const t = setTimeout(() => {
                setMounted(false);
            }, 300);

            return () => clearTimeout(t);
        }
    }, [authOpen]);

    useEffect(() => {
        if (authOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        }
    }, [authOpen]);

    useEffect(() => {
        function handleClickOutSide(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setAuthOpen(false);
            }
        }

        if (authOpen) {
            document.addEventListener("mousedown", handleClickOutSide);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutSide)
        }
    }, [authOpen]);

    // 🔥 IMPORTANT FIX
    if (!mounted) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">

            {/* Backdrop */}
            <div
                onClick={() => setAuthOpen(false)}
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
                ${show ? "opacity-100" : "opacity-0"}`}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`
                    relative bg-white w-full max-w-md max-h-[90vh]
                    rounded-xl shadow-xl overflow-hidden flex flex-col
                    transition-all duration-300 ease-out
                    ${show
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                    }
                `}
            >

                {/* Header */}
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        {mode === "login"
                            ? "Login to your account"
                            : "Create an account"}
                    </h2>

                    <button
                        onClick={() => setAuthOpen(false)}
                        className="text-gray-500 hover:text-black"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {mode === "register" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">Job Seeker</option>
                                    <option value="recruiter">Recruiter</option>
                                </select>
                            </div>
                        )}

                        {mode === "register" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email"
                                placeholder="Enter your email"
                                className="border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                type="password"
                                placeholder="Enter your password"
                                className="border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`text-white py-2.5 rounded-md font-medium transition-all duration-300 shadow-sm
                            ${isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-md active:scale-95"
                                }`}
                        >
                            {isLoading
                                ? mode === "login"
                                    ? "Logging in..."
                                    : "Creating Account..."
                                : mode === "login"
                                    ? "Login"
                                    : "Create Account"}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        {mode === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setMode("register")}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setMode("login")}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default AuthModal;