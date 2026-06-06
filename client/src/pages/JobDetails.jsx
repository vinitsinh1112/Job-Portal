import React, { useEffect, useState } from 'react'
import axios from "axios";
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaHistory, FaRegBookmark, FaBookmark, FaBuilding } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import { BsHourglassSplit } from "react-icons/bs";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdEdit } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useModal } from '../context/modalContext';


const JobDetails = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isRecruiter = user?.role === "recruiter";

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [applied, setApplied] = useState(false);

    const [similarJobs, setSimilarJobs] = useState([]);

    const { openModal } = useModal();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {

                setLoading(true);

                // fetch job details
                const res = await axios.get(`${backendUrl}/api/jobs/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setJob(res.data.job);

                if (user) {
                    const savedRes = await axios.get(`${backendUrl}/api/jobs/saved-jobs`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const isSaved = savedRes.data.savedJobs.some(
                        (job) => job._id === id
                    );

                    setSaved(isSaved);
                }

                if (user && user.role == "user") {
                    const appRes = await axios.get(`${backendUrl}/api/applications/my-applications`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const alreadyApplied = appRes.data.applications.some(
                        (app) => app.job._id === id
                    );

                    setApplied(alreadyApplied);
                }

                const allJobsRes = await axios.get(`${backendUrl}/api/jobs?limit=5`);
                setSimilarJobs(allJobsRes.data.jobs.filter(j => j._id !== id));

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();

    }, [id]);


    const handleSaveToggle = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error("Please login first");
            return;
        }

        try {
            if (saved) {
                await axios.delete(`${backendUrl}/api/jobs/save-job/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setSaved(false);
                toast.success("Job removed from saved");
            }
            else {
                await axios.post(`${backendUrl}/api/jobs/save-job/${id}`,
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
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log(error);
        }

    }

    const Skeleton = ({ className }) => {
        return (
            <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
        );
    };


    if (loading) {
        return (
            <div className='max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6'>

                {/* LEFT SIDE */}
                <div className='w-full lg:w-2/3 space-y-6'>

                    {/* Job Overview Card */}
                    <div className='bg-white p-6 rounded-lg shadow space-y-4'>
                        <div className='flex gap-4'>
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className='flex-1 space-y-2'>
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                        </div>

                        <div className='flex gap-3 flex-wrap'>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        <Skeleton className="h-10 w-32" />
                    </div>

                    {/* Job Info Card */}
                    <div className='bg-white p-6 rounded-lg shadow space-y-4'>
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />

                        <Skeleton className="h-4 w-32 mt-4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />

                        <Skeleton className="h-4 w-40 mt-4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />

                        <Skeleton className="h-10 w-32 mt-4" />
                    </div>

                    {/* Company Card */}
                    <div className='bg-white p-6 rounded-lg shadow space-y-3'>
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>

                </div>

                {/* RIGHT SIDE - Similar Jobs */}
                <div className='w-full lg:w-1/3 bg-white p-5 rounded-lg space-y-4'>

                    <Skeleton className="h-6 w-40 mx-auto" />

                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className='p-3 rounded-lg shadow space-y-2'>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    ))}

                </div>

            </div>
        );
    }

    if (!job) {
        return <div className='p-6'>Job not found</div>
    }

    return (
        <div className='max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6'>

            <div className='w-full lg:w-2/3 space-y-6'>

                {/* Job Overview Card */}
                <div className='bg-white p-4 sm:p-6 rounded-lg shadow relative'>

                    {isRecruiter && (
                        <button
                            onClick={() =>
                                openModal("editJobOverview", {
                                    job,
                                    setJob
                                })
                            }
                            className='absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>
                    )}

                    <div className='flex flex-col lg:flex-row lg:justify-between gap-4'>

                        {/* Left Side */}
                        <div className='flex gap-3 sm:gap-4'>

                            {/* Logo */}
                            {job.createdBy?.companyLogo ? (
                                <img
                                    src={job.createdBy.companyLogo}
                                    alt="company logo"
                                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-gray-100 p-1'
                                />
                            ) : (
                                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600'>
                                    {job.createdBy?.companyName?.charAt(0) || "?"}
                                </div>
                            )}

                            <div className='min-w-0'>

                                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>

                                    <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 break-words'>{job.title}</h1>

                                    {job.isDeleted ? (
                                        <span className='text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded whitespace-nowrap'>
                                            Deleted
                                        </span>
                                    ) : job.status === "open" ? (
                                        <span className='text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap'>
                                            {job.status}
                                        </span>
                                    ) : (
                                        <span className='text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded whitespace-nowrap'>
                                            {job.status}
                                        </span>
                                    )}

                                    {!isRecruiter && (
                                        <button
                                            onClick={handleSaveToggle}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                        >
                                            {saved ? <FaBookmark /> : <FaRegBookmark />}
                                        </button>
                                    )}

                                </div>

                                <p className='text-gray-600 flex items-center gap-1 text-sm mt-1'>
                                    <FaBuilding />
                                    <span className='truncate'>{job.createdBy?.companyName}</span>
                                </p>

                                <p className='text-sm text-gray-500 mt-1'>
                                    Posted: {formatDistanceToNow(new Date(job.createdAt), {
                                        addSuffix: true,
                                        includeSeconds: false
                                    }).replace("about ", "")}
                                </p>

                                <div className='flex flex-wrap gap-3 mt-1 text-gray-600 text-sm'>

                                    <div className='flex items-center gap-1'>
                                        <FaMapMarkerAlt />
                                        <span>{job.location}</span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <FaRupeeSign />
                                        <span>{job.salary}</span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <FaBriefcase />
                                        <span>{job.jobType}</span>
                                    </div>

                                </div>

                                <div className='flex flex-wrap gap-3 mt-1 text-gray-600 text-sm'>

                                    <div className='flex items-center gap-1'>
                                        <FaHistory />
                                        <span>
                                            {Array.isArray(job.experience)
                                                ? job.experience.join(", ")
                                                : job.experience}
                                        </span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <HiUsers className='text-lg' />
                                        <span>{job.positions} Positions</span>
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <BsHourglassSplit />
                                        <span>
                                            {new Date(job.applicationDeadline).toLocaleDateString(
                                                "en-IN",
                                                { day: "numeric", month: "long", year: "numeric" }
                                            )}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Right Side */}
                        <div className='flex lg:items-start items-center'>

                            {!isRecruiter && (
                                job.status === "open" ? (
                                    applied ? (
                                        <button className="text-white px-4 sm:px-5 py-2 rounded-md font-medium w-full lg:w-auto cursor-not-allowed
                                        bg-gradient-to-r from-green-600 to-emerald-700
                                        opacity-80">
                                            Applied
                                        </button>
                                    ) : (
                                        <button onClick={() => openModal("applyJob", {
                                            jobId: id,
                                            user,
                                            setApplied
                                        })}
                                            className="text-white px-5 py-2 rounded-md font-medium
                                            bg-gradient-to-r from-blue-500 to-indigo-600
                                            hover:from-blue-600 hover:to-indigo-700
                                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            Apply Now
                                        </button>

                                    )
                                ) : (
                                    <button className='bg-gray-300 text-gray-600 px-4 sm:px-5 py-2 rounded-md font-medium cursor-not-allowed w-full lg:w-auto'>
                                        Applications Closed
                                    </button>
                                )
                            )}

                        </div>

                    </div>
                </div>

                {/* Jod Info Card */}
                <div className='bg-white p-6 rounded-lg shadow relative'>

                    {isRecruiter && (
                        <button
                            onClick={() =>
                                openModal("editJobInfo", {
                                    job,
                                    setJob
                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'>
                            <MdEdit />
                        </button>
                    )}

                    <h3 className='text-md font-semibold text-gray-800 mt-2 mb-2'>Job Description</h3>
                    <p className='text-gray-600 leading-relaxed'>{job.description}</p>

                    <h3 className='text-md font-semibold text-gray-800 mt-6 mb-2'>Requirements</h3>
                    <ul className='list-disc ml-5 text-gray-600 space-y-1'>
                        {job.requirements?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <h3 className='text-md font-semibold text-gray-800 mt-6 mb-2'>Key Responsibilities</h3>
                    <ul className='list-disc ml-5 text-gray-600 space-y-1'>
                        {job.responsibilities?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <div className='mt-6 flex justify-end'>
                        {!isRecruiter && (
                            job.status === "open" ? (
                                applied ? (
                                    <button className="text-white px-4 sm:px-5 py-2 rounded-md font-medium w-full lg:w-auto cursor-not-allowed
                                    bg-gradient-to-r from-green-500 to-emerald-600
                                    opacity-80">
                                        Applied
                                    </button>
                                ) : (
                                    <button onClick={() => openModal("applyJob", {
                                        jobId: id,
                                        user,
                                        setApplied
                                    })}
                                        className="text-white px-5 py-2 rounded-md font-medium
                                        bg-gradient-to-r from-blue-500 to-indigo-600
                                        hover:from-blue-600 hover:to-indigo-700
                                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        Apply Now
                                    </button>

                                )
                            ) : (
                                <button className='bg-gray-300 text-gray-600 px-4 sm:px-5 py-2 rounded-md font-medium cursor-not-allowed w-full lg:w-auto'>
                                    Applications Closed
                                </button>
                            )
                        )}

                    </div>

                </div>

                {/* Company Card */}
                <div className='bg-white p-7 rounded-lg shadow relative'>

                    <h2 className="text-lg font-semibold text-gray-800 mb-3">About the Company</h2>
                    <p className='text-gray-600 leading-relaxed text-justify'>{job.createdBy?.companyDescription}</p>

                    <span>Visit Our Site : <a href={job.createdBy?.companyWebsite} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline mt-3 inline-block cursor-pointer'>{job.createdBy?.companyWebsite}</a></span>
                </div>

            </div>

            {/* Jobs-Insights Card */}
            {!isRecruiter && (
                <div className='w-full lg:w-1/3 bg-white p-5 rounded-lg h-fit lg:sticky lg:top-6'>
                    <h1 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>Similar Jobs</h1>

                    {similarJobs.map((item) => (
                        <div key={item._id} onClick={() => navigate(`/dashboard/jobs/${item._id}`)} className='pb-3 mb-3 cursor-pointer hover:bg-gray-100 p-3 rounded shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                            <h2 className='text-lg font-semibold text-gray-800'>{item.title}</h2>
                            <p className='text-md text-gray-500'>{item.createdBy?.companyName}</p>
                            <p className='text-sm text-gray-500 flex items-center gap-1'><FaMapMarkerAlt />{item.location}</p>
                            <p className='text-xs text-gray-500 flex items-center gap-1'><FaRupeeSign />{item.salary}</p>
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}

export default JobDetails
