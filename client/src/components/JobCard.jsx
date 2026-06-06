import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaBuilding, FaMapMarkerAlt, FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JobCard = ({
    id,
    title,
    company,
    logo,
    location,
    salary,
    type,
    isNew,
    isDeleted,
    loading = false
}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    const handleViewApplicants = async (e, jobId) => {
        e.stopPropagation();

        try {
            const res = await axios.get(
                `${backendUrl}/api/jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.job?.isDeleted) {
                toast.info(
                    "This job was deleted by admin. Applicants are no longer available."
                );
                return;
            }

            navigate(`/dashboard/jobs/${jobId}/applicants`);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Unable to verify job status"
            );
        }
    };

    // ---------------- SKELETON UI ----------------
    if (loading) {
        return (
            <div className="animate-pulse bg-white p-5 rounded-lg shadow border flex justify-between min-h-[180px]">

                {/* left */}
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

                    <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-40"></div>
                        <div className="h-3 bg-gray-300 rounded w-28"></div>
                        <div className="h-3 bg-gray-300 rounded w-36"></div>

                        <div className="flex gap-2 mt-3">
                            <div className="h-5 w-12 bg-gray-300 rounded"></div>
                            <div className="h-5 w-12 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    <div className="h-8 w-28 bg-gray-300 rounded"></div>
                </div>

            </div>
        );
    }

    // ---------------- CHECK SAVED ----------------
    useEffect(() => {
        const checkIfSaved = async () => {
            if (!user) return;

            try {
                const res = await axios.get(
                    `${backendUrl}/api/jobs/saved-jobs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const isSaved = res.data.savedJobs.some(
                    (job) => job._id === id
                );

                setSaved(isSaved);
            } catch (error) {
                console.log(error);
            }
        };

        checkIfSaved();
    }, [id]);

    // ---------------- SAVE TOGGLE ----------------
    const handleSaveToggle = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error("Please login first");
            return;
        }

        try {
            if (saved) {
                await axios.delete(
                    `${backendUrl}/api/jobs/save-job/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setSaved(false);
                toast.success("Job removed from saved");
            } else {
                await axios.post(
                    `${backendUrl}/api/jobs/save-job/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setSaved(true);
                toast.success("Job saved successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="relative bg-white p-5 rounded-lg shadow border flex flex-col justify-between hover:shadow-md hover:bg-gray-50 transition cursor-pointer min-h-[180px]" onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/jobs/${id}`);
        }}>

            {/* SAVE BUTTON */}
            <button
                onClick={handleSaveToggle}
                className="absolute top-3 right-3 text-lg"
            >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            {/* LEFT */}
            <div className="flex items-start gap-4">

                {/* LOGO */}
                {logo ? (
                    <img
                        src={logo}
                        alt="company logo"
                        className="w-14 h-14 rounded-full object-contain bg-gray-100 p-1"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {company?.charAt(0) || "?"}
                    </div>
                )}

                {/* INFO */}
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-gray-800">
                        {title}
                    </h2>

                    <p className="text-gray-600 flex items-center gap-1">
                        <FaBuilding />
                        {company}
                    </p>

                    <p className="text-gray-500 text-sm flex flex-wrap items-center gap-1">
                        <FaMapMarkerAlt />
                        {location} | {salary}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {type && (
                            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {type}
                            </span>
                        )}
                        {isNew && (
                            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                New
                            </span>
                        )}

                        {user?.role === "recruiter" && isDeleted && (
                            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
                                Deleted
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex justify-end">

                {user?.role === "recruiter" && (
                    <button
                        onClick={(e) => handleViewApplicants(e, id)}
                        className="text-sm font-medium text-white px-2 py-1.5 rounded-md
                        bg-gradient-to-r from-blue-500 to-indigo-600
                        hover:from-blue-600 hover:to-indigo-700
                        shadow-sm hover:shadow-md
                        transition-all duration-300 active:scale-95"
                    >
                        View Applicants
                    </button>
                )}

            </div>
        </div>
    );
};

export default JobCard;