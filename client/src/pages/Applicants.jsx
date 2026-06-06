import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApplicantCard from '../components/ApplicantCard';
import Pagination from '../components/Pagination';


const Applicants = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { jobId } = useParams();
    const token = localStorage.getItem("token");

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    if (!jobId) {
        return <div className="p-6">Invalid Job ID</div>;
    }

    useEffect(() => {

        const fetchApplicants = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `${backendUrl}/api/applications/job/${jobId}`,
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

                setApplicants(res.data.applications || []);
                setTotalPages(res.data.totalPages || 1);

            } catch (error) {

                const msg = error.response?.data?.message;

                if (msg === "This job has been deleted") {
                    setApplicants([]);
                    toast.info("This job has been deleted. Applications are no longer available.");
                } else {
                    toast.error(msg || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();

    }, [jobId, token, page, search]);

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* TITLE */}
            <h2 className="text-2xl font-semibold mb-6">
                Applicants ({loading ? "..." : applicants.length})
            </h2>

            <div className="bg-white p-4 mb-5 rounded-xl shadow-sm border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* LIST */}
            {loading ? (
                <div className="space-y-4">
                    <ApplicantCard loading />
                    <ApplicantCard loading />
                    <ApplicantCard loading />
                </div>
            ) : applicants.length === 0 ? (
                <p className="text-gray-500">
                    No applicants yet
                </p>
            ) : (
                <div className="space-y-4">
                    {applicants.map((applicant) => (
                        <ApplicantCard
                            key={applicant._id}
                            applicant={applicant}
                        />
                    ))}
                </div>
            )}

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

        </div>
    );
};

export default Applicants;