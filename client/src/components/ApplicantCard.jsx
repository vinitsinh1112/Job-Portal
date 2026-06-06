import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ApplicantCard = ({ applicant, loading = false }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const token = localStorage.getItem("token");
    const [currentStatus, setCurrentStatus] = useState(applicant?.status);

    // ---------------- SKELETON ----------------
    if (loading) {
        return (
            <div className="animate-pulse w-full bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4">

                {/* avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full"></div>

                {/* content */}
                <div className="flex-1 space-y-3">

                    {/* name + status */}
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>

                    {/* email */}
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>

                    {/* bio */}
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>

                    {/* skills */}
                    <div className="flex gap-2">
                        <div className="h-5 w-12 bg-gray-300 rounded"></div>
                        <div className="h-5 w-12 bg-gray-300 rounded"></div>
                        <div className="h-5 w-12 bg-gray-300 rounded"></div>
                    </div>

                    {/* bottom */}
                    <div className="flex justify-between">
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>

                </div>

            </div>
        );
    }

    const { user = {}, status, createdAt, resume } = applicant;

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.patch(
                `${backendUrl}/api/applications/status/${applicant._id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCurrentStatus(newStatus);
            toast.success("Status Updated");

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className='w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-4'>

            {/* profile image */}
            <img
                src={user.profileImage || "/default-avatar.png"}
                alt={user.name || "User"}
                className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain border'
            />

            {/* content */}
            <div className='flex-1'>

                {/* top */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>

                    <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                        {user.name}
                    </h2>

                    <div className="flex items-center gap-2">

                        <span className={`text-xs sm:text-sm px-3 py-1 rounded-md
                            ${currentStatus === "Pending" && "bg-yellow-100 text-yellow-700"}
                            ${currentStatus === "Reviewed" && "bg-blue-100 text-blue-700"}
                            ${currentStatus === "Interview" && "bg-purple-100 text-purple-700"}
                            ${currentStatus === "Hired" && "bg-green-100 text-green-700"}
                            ${currentStatus === "Rejected" && "bg-red-100 text-red-700"}
                        `}>
                            {currentStatus}
                        </span>

                        <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="text-xs border rounded-md px-2 py-1 bg-white"
                        >
                            <option>Pending</option>
                            <option>Reviewed</option>
                            <option>Interview</option>
                            <option>Hired</option>
                            <option>Rejected</option>
                        </select>

                    </div>
                </div>

                {/* email */}
                <p className="text-sm text-gray-600 break-all mt-1">
                    {user.email}
                </p>

                {/* bio */}
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {user.bio || "No bio available"}
                </p>

                {/* skills */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? (
                        user.skills.map((skill, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">
                            No skills listed
                        </span>
                    )}
                </div>

                {/* bottom */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <p className="text-xs text-gray-500">
                        Applied on :{" "}
                        {createdAt
                            ? new Date(createdAt).toLocaleDateString()
                            : "N/A"}
                    </p>

                    {resume && (
                        <a
                            href={resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View Resume
                        </a>
                    )}

                </div>

            </div>
        </div>
    );
};

export default ApplicantCard;