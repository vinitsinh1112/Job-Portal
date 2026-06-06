import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobInfoModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState([]);
    const [responsibilities, setResponsibilities] = useState([]);

    const [reqInput, setReqInput] = useState("");
    const [resInput, setResInput] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modalData?.job) {
            const job = modalData.job;
            setDescription(job.description || "");
            setRequirements(job.requirements || []);
            setResponsibilities(job.responsibilities || []);
        }
    }, [modalData]);

    const handleAddRequirement = () => {
        if (!reqInput.trim()) return;
        setRequirements([...requirements, reqInput.trim()]);
        setReqInput("");
    }

    const removeRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    }

    const handleAddResponsibility = () => {
        if (!resInput.trim()) return;
        setResponsibilities([...responsibilities, resInput.trim()]);
        setResInput("");
    }

    const removeResponsibility = (index) => {
        setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const data = { description, requirements, responsibilities };

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

            toast.success("Job info updated successfully");
            closeModal();

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">

            {/* 🔥 Sticky Header (NO SCROLL) */}
            <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 border-b flex justify-between items-center">
                <h2 className='text-lg sm:text-xl font-semibold'>
                    Edit Job Info
                </h2>
            </div>

            {/* 🔥 Scrollable Content ONLY */}
            <form
                className='flex flex-col gap-5 px-4 py-4 overflow-y-auto flex-1'
                onSubmit={handleSubmit}
            >

                {/* Description */}
                <div className='flex flex-col gap-2'>
                    <label className="text-sm sm:text-md font-medium text-gray-700">
                        Job Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="border rounded-md px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                </div>

                {/* Requirements */}
                <div className='flex flex-col gap-2'>
                    <label className="text-sm sm:text-md font-medium text-gray-700">
                        Requirements
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        {requirements.map((item, index) => (
                            <div
                                key={index}
                                className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm'
                            >
                                <span className='break-words'>{item}</span>
                                <button
                                    type='button'
                                    onClick={() => removeRequirement(index)}
                                    className='ml-2 text-red-500'
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        <input
                            type='text'
                            value={reqInput}
                            onChange={(e) => setReqInput(e.target.value)}
                            placeholder='Add requirement'
                            className='border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
                        />

                        <button
                            type='button'
                            onClick={handleAddRequirement}
                            className='text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto
                            bg-gradient-to-r from-green-500 to-emerald-600
                            hover:from-green-600 hover:to-emerald-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95'
                        >
                            <FaPlusCircle /> Add
                        </button>
                    </div>
                </div>

                {/* Responsibilities */}
                <div className='flex flex-col gap-2'>
                    <label className="text-sm sm:text-md font-medium text-gray-700">
                        Key Responsibilities
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        {responsibilities.map((item, index) => (
                            <div
                                key={index}
                                className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm'
                            >
                                <span className='break-words'>{item}</span>
                                <button
                                    type='button'
                                    onClick={() => removeResponsibility(index)}
                                    className='ml-2 text-red-500'
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        <input
                            type='text'
                            value={resInput}
                            onChange={(e) => setResInput(e.target.value)}
                            placeholder='Add responsibility'
                            className='border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
                        />

                        <button
                            type='button'
                            onClick={handleAddResponsibility}
                            className='text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto
                            bg-gradient-to-r from-green-500 to-emerald-600
                            hover:from-green-600 hover:to-emerald-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95'
                        >
                            <FaPlusCircle /> Add
                        </button>
                    </div>
                </div>

                {/* Submit */}
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
    )
}

export default JobInfoModal;