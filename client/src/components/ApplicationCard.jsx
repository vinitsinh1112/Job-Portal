import React from 'react'
import { FaBuilding } from 'react-icons/fa';

const ApplicationCard = ({
    title,
    company,
    date,
    status,
    loading = false
}) => {

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

    // ---------------- SKELETON ----------------
    if (loading) {
        return (
            <div className="animate-pulse border p-4 rounded-lg flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                {/* left */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>

                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>

                {/* right */}
                <div className="h-6 w-20 bg-gray-300 rounded-md self-start sm:self-auto"></div>

            </div>
        );
    }

    return (
        <div className='border p-4 rounded-lg flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 hover:shadow transition'>

            {/* LEFT SIDE */}
            <div className='flex-1'>

                <p className='font-bold text-gray-800'>
                    {title}
                </p>

                <p className='text-md text-gray-500 flex gap-1 items-center'>
                    <FaBuilding />
                    {company}
                </p>

                <p className='text-sm text-gray-400'>
                    Applied on: {date}
                </p>

            </div>

            {/* STATUS */}
            <span className={`text-xs px-3 py-1 rounded-md w-fit inline-block ${getStatusStyle(status)}`}>
                {status}
            </span>

        </div>
    );
};

export default ApplicationCard;