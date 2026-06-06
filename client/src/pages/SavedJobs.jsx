import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";

const SavedJobs = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10;

    // 🔥 API CALL
    const fetchSavedJobs = async (currentPage = 1, searchText = "") => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${backendUrl}/api/jobs/saved-jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: currentPage,
                        limit,
                        search: searchText,
                    },
                }
            );

            setJobs(res.data?.savedJobs || []);
            setTotalPages(res.data?.totalPages || 1);
            setPage(res.data?.currentPage || 1);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    // 📦 initial load + page change
    useEffect(() => {
        fetchSavedJobs(page, search);
    }, [page]);

    // 🔍 search handler (debounced)
    useEffect(() => {
        const delay = setTimeout(() => {
            setPage(1);
            fetchSavedJobs(1, search);
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <div className="min-h-screen">

            <div className="max-w-7xl mx-auto">

                <h1 className="text-2xl font-semibold mb-5">Saved Jobs</h1>

                {/* 🔍 SEARCH BAR */}
                <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <input
                        type="text"
                        placeholder="Search saved jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 📄 JOB LIST */}
                <div className="space-y-4 mt-6">

                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="relative bg-white p-5 rounded-lg shadow border flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-pulse"
                            >
                                <div className="absolute top-3 right-3 w-5 h-5 bg-gray-200 rounded"></div>

                                <div className="flex items-start gap-4 w-full">
                                    <div className="w-14 h-14 rounded-full bg-gray-200"></div>

                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>

                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : jobs.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">
                            No saved jobs found
                        </p>
                    ) : (
                        jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                id={job._id}
                                title={job.title}
                                company={job.createdBy?.companyName}
                                logo={job.createdBy?.companyLogo}
                                location={job.location}
                                salary={job.salary}
                                type={job.jobType}
                                isNew={false}
                            />
                        ))
                    )}

                    {/* 📄 PAGINATION */}
                    <div className="flex justify-center mt-8">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SavedJobs;