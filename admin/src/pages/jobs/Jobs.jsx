import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import Pagination from '../../components/Pagination';

const Jobs = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);


    const getJobs = async () => {
        try {

            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/admin/jobs`,
                {
                    params: {
                        page,
                        limit: 10,
                        search,
                        status: status || undefined,
                        sort
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJobs(response.data.jobs);
            setTotalPages(response.data.totalPages)

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");

        } finally {
            setLoading(false);
        }
    }


    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setSort("newest");
    }

    const handleDelete = async (id) => {
        try {

            const confirmDelete = window.confirm("Delete this job ?");

            if (!confirmDelete) return;

            setActionLoading(id);

            const response = await axios.patch(
                `${backendUrl}/api/admin/jobs/${id}/delete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job._id === id
                        ? { ...job, isDeleted: true }
                        : job
                )
            );

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setActionLoading(null);
        }
    }


    const handleRestore = async (id) => {
        try {

            const confirmRestore = window.confirm("Restore this job ?");

            if (!confirmRestore) return;

            setActionLoading(id);

            const response = await axios.patch(
                `${backendUrl}/api/admin/jobs/${id}/restore`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job._id === id
                        ? { ...job, isDeleted: false }
                        : job
                )
            );

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setActionLoading(null);
        }
    }


    useEffect(() => {
        getJobs();
    }, [search, status, sort, page]);

    return (
        <div>
            <div className='mb-5'>
                <h1 className='text-2xl font-semibold'>Jobs</h1>
            </div>

            {/* Filters */}

            <div className='bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6'>

                <h2 className='text-lg font-bold text-gray-800'>Filters</h2>

                <input
                    type='text'
                    placeholder='Search Jobs'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <div className='flex flex-col sm:flex-row flex-wrap gap-6 w-full md:w-auto'>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} className='border rounded-md px-3 py-2'>
                        <option value="">Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="deleted">Deleted</option>
                    </select>

                    <select value={sort} onChange={(e) => setSort(e.target.value)} className='border rounded-md px-3 py-2'>
                        <option value="">Sort</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <button onClick={clearFilters} className="text-white px-4 py-2 rounded-md font-medium
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    hover:from-blue-600 hover:to-indigo-700
                    transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
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
                                <th className='px-4 py-3 text-left'>Title</th>
                                <th className='px-4 py-3 text-left'>Company</th>
                                <th className='px-4 py-3 text-left'>Posted By</th>
                                <th className='px-4 py-3 text-left'>Created Date</th>
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
                                            <div className="h-4 w-32 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-28 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-24 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <div className="h-6 w-16 bg-gray-300 rounded mx-auto shimmer"></div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <div className="h-7 w-14 bg-gray-300 rounded shimmer"></div>
                                                <div className="h-7 w-14 bg-gray-300 rounded shimmer"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                jobs.map((job, index) => (
                                    <tr key={job._id} className='border-b hover:bg-gray-50'>
                                        <td className='px-4 py-3 text-center'>{index + 1}</td>
                                        <td className='px-4 py-3'>{job.title}</td>
                                        <td className='px-4 py-3'>{job.createdBy?.companyName}</td>
                                        <td className='px-4 py-3'>{job.createdBy?.name}</td>
                                        <td className='px-4 py-3'>{new Date(job.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                                        <td className='px-4 py-3 text-center'>

                                            <span
                                                className={`px-2 py-1 rounded-lg text-sm font-semibold
                                                        ${job.isDeleted
                                                        ? "bg-red-100 text-red-700"
                                                        : job.status === "closed"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                            >

                                                {job.isDeleted ? "Deleted" : job.status.charAt(0).toUpperCase() + job.status.slice(1)}

                                            </span>

                                        </td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-center gap-4'>
                                                <button onClick={() => navigate(`/jobs/${job._id}`)} className='text-blue-600 px-2 py-1 bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors duration-200 rounded-xl text-sm font-semibold'>View</button>

                                                {job.isDeleted ? (
                                                    <button
                                                        disabled={actionLoading === job._id}
                                                        onClick={() => handleRestore(job._id)}
                                                        className={`px-2 py-1 rounded-xl text-sm font-semibold transition-colors duration-200
                                                                ${actionLoading === job._id
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                                                            }`}
                                                    >
                                                        {actionLoading === job._id
                                                            ? "Restoring..."
                                                            : "Restore"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled={actionLoading === job._id}
                                                        onClick={() => handleDelete(job._id)}
                                                        className={`px-2 py-1 rounded-xl text-sm font-semibold transition-colors duration-200
                                                                ${actionLoading === job._id
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                                                            }`}
                                                    >
                                                        {actionLoading === job._id
                                                            ? "Deleting..."
                                                            : "Delete"}
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

export default Jobs
