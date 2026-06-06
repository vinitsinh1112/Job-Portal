import React, { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaHistory, FaRegBookmark, FaBuilding } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import { BsHourglassSplit } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const JobDetails = () => {

    const { id } = useParams();

    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const getJobDetails = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/jobs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setJob(response.data.job);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getJobDetails();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-gray-500">
                Loading job details...
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-6 text-red-500">
                Job not found
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>

            {/* JOB OVERVIEW */}
            <div className='bg-white p-6 rounded-lg shadow'>

                <div className='flex flex-col lg:flex-row lg:justify-between gap-4'>

                    <div className='flex gap-4'>

                        <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600'>
                            {job?.createdBy?.companyName?.charAt(0) || "C"}
                        </div>

                        <div>

                            <div className='flex flex-wrap items-center gap-2'>

                                <h1 className='text-2xl font-semibold'>
                                    {job?.title}
                                </h1>

                                <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded'>
                                    {job?.status}
                                </span>

                            </div>

                            <p className='text-gray-600 flex items-center gap-1 text-sm mt-1'>
                                <FaBuilding />
                                {job?.createdBy?.companyName}
                            </p>

                            <p className='text-sm text-gray-500 mt-1'>
                                Posted:{" "}
                                {job?.createdAt &&
                                    formatDistanceToNow(new Date(job.createdAt), {
                                        addSuffix: true
                                    })}
                            </p>

                            <div className='flex flex-wrap gap-3 mt-2 text-sm text-gray-600'>

                                <div className='flex items-center gap-1'>
                                    <FaMapMarkerAlt />
                                    {job?.location}
                                </div>

                                <div className='flex items-center gap-1'>
                                    <FaRupeeSign />
                                    {job?.salary}
                                </div>

                                <div className='flex items-center gap-1'>
                                    <FaBriefcase />
                                    {job?.jobType}
                                </div>

                            </div>

                            <div className='flex flex-wrap gap-3 mt-2 text-sm text-gray-600'>

                                <div className='flex items-center gap-1'>
                                    <FaHistory />
                                    {job?.experience?.join(", ")}
                                </div>

                                <div className='flex items-center gap-1'>
                                    <HiUsers />
                                    {job?.positions} Positions
                                </div>

                                <div className='flex items-center gap-1'>
                                    <BsHourglassSplit />
                                    {job?.applicationDeadline
                                        ? new Date(job.applicationDeadline).toLocaleDateString()
                                        : ""}
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* JOB INFO */}
            <div className='bg-white p-6 rounded-lg shadow mt-6'>

                <h3 className='font-semibold mb-2'>Job Description</h3>
                <p className='text-gray-600'>{job?.description}</p>

                <h3 className='font-semibold mt-5 mb-2'>Requirements</h3>
                <ul className='list-disc ml-5 text-gray-600'>
                    {job?.requirements?.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>

                <h3 className='font-semibold mt-5 mb-2'>Responsibilities</h3>
                <ul className='list-disc ml-5 text-gray-600'>
                    {job?.responsibilities?.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>

            </div>

            {/* COMPANY */}
            <div className='bg-white p-6 rounded-lg shadow mt-6'>

                <h2 className="text-lg font-semibold mb-3">
                    About the Company
                </h2>

                <p className='text-gray-600'>
                    {job?.createdBy?.companyDescription}
                </p>

                {job?.createdBy?.companyWebsite && (
                    <a
                        href={job.createdBy.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='text-blue-600 hover:underline mt-3 inline-block'
                    >
                        Visit Website
                    </a>
                )}

            </div>

        </div>
    )
}

export default JobDetails;