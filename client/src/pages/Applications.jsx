import React, { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination.jsx";

const Applications = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // 🔍 SEARCH STATE (MISSING IN YOUR CODE)
    const [search, setSearch] = useState("");

    const fetchApplications = async (pageNumber = 1, searchText = "") => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${backendUrl}/api/applications/my-applications`,
                {
                    params: {
                        page: pageNumber,
                        limit: 10,
                        search: searchText,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications(response.data.applications || []);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || 1);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch applications"
            );
        } finally {
            setLoading(false);
        }
    };

    // 📦 initial load + page change
    useEffect(() => {
        fetchApplications(currentPage, search);
    }, [currentPage]);

    // 🔍 search handler (debounce)
    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(1);
            fetchApplications(1, search);
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <div className="flex flex-col space-y-4">

            {/* TITLE */}
            <h1 className='text-2xl font-semibold'>Applications</h1>

            {/* 🔍 SEARCH BAR */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <input
                    type="text"
                    placeholder="Search applications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* LIST */}
            <div className=" bg-white rounded-xl space-y-3 mt-4 p-4">
                {loading ? (
                    <>
                        <ApplicationCard loading />
                        <ApplicationCard loading />
                        <ApplicationCard loading />
                    </>
                ) : applications.length === 0 ? (
                    <p className="text-gray-500">No Applications found</p>
                ) : (
                    applications.map((application) => {
                        const jobDeleted = application.job?.isDeleted;

                        return (
                            <ApplicationCard
                                key={application._id}
                                title={jobDeleted ? "Job Deleted" : application.job?.title}
                                company={jobDeleted ? "N/A" : application.job?.createdBy?.companyName}
                                date={new Date(application.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                                status={jobDeleted ? "Deleted" : application.status}
                            />
                        );
                    })
                )}
            </div>

            {/* PAGINATION */}
            <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />


        </div>
    );
};

export default Applications;