import React, { useEffect, useState } from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import '../../index.css'
import Pagination from '../../components/Pagination';

const Users = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const navigate = useNavigate();

    const getUsers = async () => {
        try {

            setLoading(true)

            const response = await axios.get(
                `${backendUrl}/api/admin/users`,
                {
                    params: {
                        page,
                        limit: 10,
                        search,
                        status,
                        role,
                        sort
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false);
        }
    }

    const updateStatus = async (id, currentStatus) => {
        try {

            setActionLoading(id)

            const response = await axios.patch(`${backendUrl}/api/admin/users/${id}/status`,
                {
                    isBlocked: !currentStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id
                        ? { ...user, isBlocked: !currentStatus }
                        : user
                )
            );

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something wen wrong");
        } finally {
            setActionLoading(null);
        }

    }

    useEffect(() => {
        getUsers();
    }, [search, status, role, sort, page]);

    return (
        <div>
            <div className='mb-5'>
                <h1 className='text-2xl font-semibold'>Users</h1>
            </div>

            {/* Filters */}

            <div className='bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6'>

                <h2 className='text-lg font-bold text-gray-800'>Filters</h2>

                <input
                    type='text'
                    placeholder='Search Users'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <div className='flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto'>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} className='border rounded-md px-3 py-2'>
                        <option value="">Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>

                    </select>

                    <select value={role} onChange={(e) => setRole(e.target.value)} className='border rounded-md px-2 py-2'>
                        <option value="">Role</option>
                        <option value="user">User</option>
                        <option value="recruiter">Recruiter</option>
                    </select>

                    <select value={sort} onChange={(e) => setSort(e.target.value)} className='border rounded-md px-2 py-2'>
                        <option>Sort</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <button
                        className="text-white px-4 py-2 rounded-md font-medium
                        bg-gradient-to-r from-blue-500 to-indigo-600
                        hover:from-blue-600 hover:to-indigo-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        onClick={() => {
                            setSearch("");
                            setStatus("");
                            setRole("");
                            setSort("newest");
                        }}
                    >
                        Clear
                    </button>

                </div>

            </div>

            {/* Table card */}
            <div className='bg-white rounded-lg shadow'>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[800px]'>
                        <thead className=''>
                            <tr className='bg-gray-100  border-b text-gray-700'>
                                <th className='px-4 py-2 text-center'>No.</th>
                                <th className='px-4 py-3 text-left'>Name</th>
                                <th className='px-4 py-3 text-left'>Email</th>
                                <th className='px-4 py-3 text-left'>Role</th>
                                <th className='px-4 py-3 text-left'>Joined Date</th>
                                <th className='px-4 py-3 text-center'>Status</th>
                                <th className='px-4 py-3 text-center'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className='border-b'>
                                        <td className="px-4 py-3 text-center">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-24 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-32 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-16 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <div className="h-6 w-16 bg-gray-300 rounded shimmer mx-auto"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <div className="h-6 w-12 bg-gray-300 rounded shimmer"></div>
                                                <div className="h-6 w-12 bg-gray-300 rounded shimmer"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id} className='border-b hover:bg-gray-50'>
                                        <td className='px-4 py-3 text-center'>{index + 1}</td>
                                        <td className='px-4 py-3'>{user.name}</td>
                                        <td className='px-4 py-3'>{user.email}</td>
                                        <td className='px-4 py-3'>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                        <td className='px-4 py-3'>{new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                                        <td className='px-4 py-3 text-center'>
                                            <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${user.isBlocked ? "bg-red-100 text-red-700 " : "bg-green-100 text-green-700"}`}>{user.isBlocked ? "Blocked" : "Active"}</span>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-center gap-4'>
                                                <button onClick={() => navigate(`/users/${user._id}`)} className='text-blue-600 px-2 py-1 bg-blue-100 rounded-xl text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200'>View</button>
                                                {user.isBlocked ? (
                                                    <button
                                                        disabled={actionLoading === user._id}
                                                        onClick={() => {
                                                            const confirmUnblock = window.confirm("Are you sure you want to unblock this user?");
                                                            if (confirmUnblock) {
                                                                updateStatus(user._id, user.isBlocked);
                                                            }
                                                        }}
                                                        className={`px-2 py-1 rounded-xl text-sm font-semibold transition-colors duration-200
                                                                ${actionLoading === user._id
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
                                                            }`}
                                                    >
                                                        {actionLoading === user._id ? "Loading..." : "Unblock"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled={actionLoading === user._id}
                                                        onClick={() => {
                                                            const confirmBlock = window.confirm("Are you sure you want to block this user?");
                                                            if (confirmBlock) {
                                                                updateStatus(user._id, user.isBlocked);
                                                            }
                                                        }}
                                                        className={`px-2 py-1 rounded-xl text-sm font-semibold transition-colors duration-200
                                                                ${actionLoading === user._id
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "text-red-600 bg-red-100 hover:bg-red-600 hover:text-white"
                                                            }`}
                                                    >
                                                        {actionLoading === user._id ? "Loading..." : "Block"}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>
    )
}

export default Users
