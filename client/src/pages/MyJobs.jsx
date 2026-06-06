import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';

const MyJobs = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${backendUrl}/api/jobs/recruiter-jobs`,
                {
                    params: {
                        page,
                        limit: 10,
                        search
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJobs(res.data.jobs || []);
            setTotalPages(res.data.totalPages || 1);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, [page, search]);

    // ---------------- SKELETON ----------------
    const JobSkeleton = () => (
        <div className="bg-white p-5 rounded-lg shadow border animate-pulse flex flex-col gap-3">

            <div className="flex items-start gap-4">

                {/* logo */}
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
                    <div className="h-3 bg-gray-300 w-1/2 rounded"></div>
                    <div className="h-3 bg-gray-300 w-3/4 rounded"></div>
                </div>
            </div>

            {/* buttons skeleton */}
            <div className="flex justify-end gap-2 mt-2">
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-28 bg-gray-300 rounded"></div>
            </div>
        </div>
    );

    return (
        <div className='space-y-6'>

            {/* HEADER */}
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-semibold'>My Jobs</h1>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* JOB LIST */}
            <div className='space-y-4 mt-2'>

                {loading ? (
                    <>
                        <JobSkeleton />
                        <JobSkeleton />
                        <JobSkeleton />
                        <JobSkeleton />
                        <JobSkeleton />
                    </>
                ) : jobs.length === 0 ? (
                    <p className="text-gray-500">No jobs found.</p>
                ) : (
                    jobs.map(job => (
                        <JobCard
                            key={job._id}
                            id={job._id}
                            title={job.title}
                            company={job.createdBy?.companyName}
                            logo={job.createdBy?.companyLogo}
                            location={job.location}
                            salary={job.salary}
                            type={job.jobType}
                            isDeleted={job.isDeleted}
                            isNew={new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                        />
                    ))
                )}

            </div>

            {/* PAGINATION */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>
    );
};

export default MyJobs;