import React, { useEffect, useState } from 'react'
import { FaUsers, FaBriefcase, FaClipboardList, FaBuilding } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios';
import toast from "react-hot-toast";
import '../index.css';


const Dashboard = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        applications: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    const getStats = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/dashboard-stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }


    const getRecentUsers = async () => {
        try {

            const response = await axios.get(`${backendUrl}/api/admin/users?limit=3`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setRecentUsers(response.data.users);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }


    const getRecentJobs = async () => {
        try {

            const response = await axios.get(`${backendUrl}/api/admin/jobs?limit=3`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response)
            setRecentJobs(response.data.jobs);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }


    useEffect(() => {

        const fetchData = async () => {

            try {

                await Promise.all([
                    getStats(),
                    getRecentUsers(),
                    getRecentJobs()
                ]);

            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }

        };
        fetchData()

    }, []);


    return (
        <div>
            <div className='mb-5'>
                <h1 className='text-2xl font-semibold'>Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

                {loading ? (
                    <>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='bg-white p-6 rounded-xl shadow-md'>
                                <div className='h-4 w-24 rounded shimmer mb-4'></div>
                                <div className='h-8 w-16 rounded shimmer'></div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className='bg-white rounded-xl p-6 shadow-md flex items-center justify-between'>
                            <div>
                                <p className='font-sans'>Total Users</p>
                                <h2 className='text-3xl font-bold mt-2'>{stats.users}</h2>
                            </div>
                            <FaUsers size={36} />
                        </div>

                        <div className='bg-white rounded-xl p-6 shadow-md flex items-center justify-between'>
                            <div>
                                <p>Total Jobs</p>
                                <h2 className='text-3xl font-bold mt-2'>{stats.jobs}</h2>
                            </div>
                            <FaBriefcase size={32} />
                        </div>

                        <div className='bg-white rounded-xl p-6 shadow-md flex items-center justify-between'>
                            <div>
                                <p>Total Applications</p>
                                <h2 className='text-3xl font-bold mt-2'>{stats.applications}</h2>
                            </div>
                            <FaClipboardList size={32} />
                        </div>
                    </>
                )
                }

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>

                {/* recent users card */}
                <div className='bg-white p-6 rounded-xl shadow-md'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Users</h2>

                    {loading ? (
                        <div className='space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <div className='h-4 shimmer w-32 rounded mb-2'></div>
                                    <div className='h-3 shimmer w-48 rounded mb-10'></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {recentUsers.map((user) => (
                                <div key={user._id} className='border-b pb-3'>
                                    <h3 className='font-medium'>{user.name}</h3>
                                    <div className='flex items-center gap-1 text-gray-500'>
                                        <MdEmail />
                                        <p className='text-sm'>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* recent jobs card */}
                <div className='bg-white p-6 rounded-xl shadow-md'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Jobs</h2>

                    {loading ? (
                        <div className='space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <div className='h-4 shimmer w-40 rounded mb-2'></div>
                                    <div className='h-3 shimmer w-28 rounded mb-10'></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {recentJobs.map((job) => (
                                <div key={job._id} className='border-b pb-3'>
                                    <h3 className='font-medium'>{job.title}</h3>
                                    <div className='flex items-center gap-1 text-gray-500'>
                                        <FaBuilding />
                                        <p className='text-sm'>
                                            {job.createdBy?.companyName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}

export default Dashboard
