import React, { useEffect, useState } from 'react'
import JobCard from "../components/JobCard.jsx";
import { toast } from 'react-toastify';
import axios from 'axios';
import Pagination from '../components/Pagination.jsx';

const Jobs = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [experience, setExperience] = useState("");
    const [jobType, setJobType] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    // ---------------- FETCH JOBS ----------------
    const fetchJobs = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${backendUrl}/api/jobs`,
                {
                    params: {
                        page,
                        limit: 10,
                        search,
                        experience,
                        jobType
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


    const clearFilters = () => {
        setSearch("");
        setExperience("");
        setJobType("");
        setPage(1);
    }


    useEffect(() => {
        fetchJobs();
    }, [page, search, experience, jobType]);

    return (
        <div className='space-y-6'>

            {/* TITLE */}
            <h1 className='text-2xl font-semibold'>Explore Jobs</h1>

            {/* ---------------- FILTERS ---------------- */}
            <div className='bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>

                <h2 className='text-lg font-bold text-gray-800'>Filters</h2>

                <input
                    type='text'
                    placeholder='Search Jobs'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1);
                    }}
                    className='w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />

                <div className='flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto'>

                    <select
                        value={experience}
                        onChange={(e) => {
                            setExperience(e.target.value)
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="">Experience</option>
                        <option value="Fresher">0-1 Year</option>
                        <option value="Junior">1-2 Years</option>
                        <option value="Mid">3-5 years</option>
                        <option value="Senior">5+ years</option>
                    </select>

                    <select
                        value={jobType}
                        onChange={(e) => {
                            setJobType(e.target.value)
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="">Job Type</option>
                        <option value="Full-time">Full Time</option>
                        <option value="Part-time">Part Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="text-white px-4 py-2 rounded-md font-medium
                        bg-gradient-to-r from-blue-500 to-indigo-600
                        hover:from-blue-600 hover:to-indigo-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
                        Clear
                    </button>

                </div>

            </div>

            {/* ---------------- JOB LIST ---------------- */}
            <div className='space-y-4 mt-2'>

                {loading ? (
                    <>
                        {/* skeleton JobCards */}
                        <JobCard loading />
                        <JobCard loading />
                        <JobCard loading />
                        <JobCard loading />
                        <JobCard loading />
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
                            isNew={
                                new Date(job.createdAt) >
                                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        />
                    ))
                )}

            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>
    );
};

export default Jobs;