import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import '../../index.css';
import Pagination from '../../components/Pagination';

const Applications = () => {

    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${backendUrl}/api/admin/applications`,
                {
                    params: {
                        page,
                        limit: 10,
                        search,
                        sort
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setApplications(response.data.applications);
                setTotalPages(response.data.totalPages);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApplications();
    }, [page, sort]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Reviewed":
                return "bg-blue-100 text-blue-700";

            case "Interview":
                return "bg-purple-100 text-purple-700";

            case "Hired":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

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
                    placeholder='Search Applications'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <div className='flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto'>

                    <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }} className='border rounded-md px-3 py-2'>
                        <option>Sort</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>

                    <button
                        onClick={() => {
                            setSearch("");
                            setSort("newest");
                            setPage(1);
                            fetchApplications();
                        }}
                        className="text-white px-4 py-2 rounded-md font-medium
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
                        <thead>
                            <tr className='bg-gray-100 border-b text-gray-700'>
                                <th className='px-4 py-3 text-center'>No.</th>
                                <th className='px-4 py-3 text-left'>Applicant</th>
                                <th className='px-4 py-3 text-left'>Email</th>
                                <th className='px-4 py-3 text-left'>Job Title</th>
                                <th className='px-4 py-3 text-left'>Company</th>
                                <th className='px-4 py-3 text-left'>Applied Date</th>
                                <th className='px-4 py-3 text-center'>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                [...Array(8)].map((_, index) => (
                                    <tr key={index} className='border-b'>
                                        <td className='px-4 py-3 text-center'>
                                            <div className='h-4 w-6 bg-gray-300 rounded mx-auto shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3'>
                                            <div className='h-4 w-28 bg-gray-300 rounded shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3'>
                                            <div className='h-4 w-36 bg-gray-300 rounded shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3'>
                                            <div className='h-4 w-32 bg-gray-300 rounded shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3'>
                                            <div className='h-4 w-28 bg-gray-300 rounded shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3'>
                                            <div className='h-4 w-24 bg-gray-300 rounded shimmer'></div>
                                        </td>

                                        <td className='px-4 py-3 text-center'>
                                            <div className='h-6 w-20 bg-gray-300 rounded mx-auto shimmer'></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                applications.map((application, index) => (
                                    <tr key={application._id} className='border-b hover:bg-gray-50'>
                                        <td className='px-4 py-3 text-center'>{index + 1}</td>
                                        <td className='px-4 py-3'>{application.user?.name}</td>
                                        <td className='px-4 py-3'>{application.user?.email}</td>
                                        <td className='px-4 py-3'>{application.job?.title}</td>
                                        <td className='px-4 py-3'>{application.job?.createdBy?.companyName}</td>
                                        <td className='px-4 py-3'>
                                            {new Date(application.createdAt).toLocaleDateString(
                                                "en-GB",
                                                { day: "2-digit", month: "2-digit", year: "numeric" }
                                            )}
                                        </td>
                                        <td className='px-4 py-3 text-center'>
                                            <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${getStatusStyle(application.status)}`}>
                                                {application.status}
                                            </span>
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

export default Applications