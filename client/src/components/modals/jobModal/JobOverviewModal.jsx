import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const JobOverviewModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("open");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [experience, setExperience] = useState([]);
    const [salary, setSalary] = useState("");
    const [positions, setPositions] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modalData?.job) {
            const job = modalData.job;

            setTitle(job.title || "");
            setStatus(job.status || "open");
            setLocation(job.location || "");
            setJobType(job.jobType || "");
            setExperience(job.experience || []);
            setSalary(job.salary || "");
            setPositions(job.positions ?? "");
            setApplicationDeadline(job.applicationDeadline?.split("T")?.[0] || "");
        }
    }, [modalData]);

    const handleUpdatedJob = async (e) => {
        e.preventDefault();
        try {

            setLoading(true);

            const data = {
                title,
                status,
                location,
                jobType,
                experience,
                salary,
                positions: Number(positions),
                applicationDeadline
            };

            const res = await axios.patch(
                `${backendUrl}/api/jobs/${modalData.job._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            modalData?.setJob?.(res.data.job);

            toast.success("Job updated successfully");
            closeModal();

        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExperienceChange = (value) => {
        setExperience((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">

            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-gray-200 px-4 py-3 border-b">
                <h2 className='text-lg sm:text-xl font-semibold'>
                    Edit Job Overview
                </h2>
            </div>

            {/* Scrollable Content */}
            <form
                className='flex flex-col gap-4 px-4 py-4 overflow-y-auto flex-1'
                onSubmit={handleUpdatedJob}
            >

                {/* Title */}
                <div>
                    <label className="text-sm font-medium">Job Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='border rounded-md px-3 py-2 w-full'
                    >
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="text-sm font-medium">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Job Type */}
                <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className='border rounded-md px-3 py-2 w-full'
                    >
                        <option value="">Select</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                {/* Experience */}
                <div>
                    <label className="text-sm font-medium">Experience</label>

                    <div className='flex gap-3 mt-2 flex-wrap'>
                        {["Fresher", "Junior", "Mid", "Senior"].map((level) => (
                            <label key={level} className='flex items-center gap-2 text-sm'>
                                <input
                                    type='checkbox'
                                    checked={experience.includes(level)}
                                    onChange={() => handleExperienceChange(level)}
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Salary */}
                <div>
                    <label className="text-sm font-medium">Salary</label>
                    <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Positions */}
                <div>
                    <label className="text-sm font-medium">Positions</label>
                    <input
                        type="number"
                        value={positions}
                        onChange={(e) => setPositions(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label className="text-sm font-medium">Deadline</label>
                    <input
                        type="date"
                        value={applicationDeadline}
                        onChange={(e) => setApplicationDeadline(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                <button
                    type='submit'
                    className={`w-full py-2.5 rounded-md font-medium text-white transition-all duration-300
                        ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                        }`}
                >
                    {loading ? "Saving..." : "Save"}
                </button>

            </form>
        </div>
    );
};

export default JobOverviewModal;