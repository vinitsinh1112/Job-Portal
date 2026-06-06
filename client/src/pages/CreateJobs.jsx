import React, { useState } from 'react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateJobs = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const experienceOptions = ["Fresher", "Junior", "Mid", "Senior"];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: [],
        responsibilities: [],
        jobType: "",
        salary: "",
        location: "",
        positions: 1,
        experience: [],
        applicationDeadline: ""
    });

    const [reqInput, setReqInput] = useState("");
    const [resInput, setResInput] = useState("");

    const handleInput = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "positions" ? Number(value) : value
        });
    }

    const handleExperienceChange = (value) => {
        if (formData.experience.includes(value)) {
            setFormData({
                ...formData,
                experience: formData.experience.filter((item) => item !== value)
            });
        } else {
            setFormData({
                ...formData,
                experience: [...formData.experience, value]
            });
        }
    }

    // REQUIREMENTS
    const addRequirement = () => {
        if (!reqInput.trim()) return;

        setFormData({
            ...formData,
            requirements: [...formData.requirements, reqInput.trim()]
        });

        setReqInput("");
    }

    const removeRequirement = (index) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter((_, i) => i !== index)
        });
    }

    // RESPONSIBILITIES
    const addResponsibility = () => {
        if (!resInput.trim()) return;

        setFormData({
            ...formData,
            responsibilities: [...formData.responsibilities, resInput.trim()]
        });

        setResInput("");
    }

    const removeResponsibility = (index) => {
        setFormData({
            ...formData,
            responsibilities: formData.responsibilities.filter((_, i) => i !== index)
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${backendUrl}/api/jobs/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Job created successfully");

            setFormData({
                title: "",
                description: "",
                requirements: [],
                responsibilities: [],
                jobType: "",
                salary: "",
                location: "",
                positions: 1,
                experience: [],
                applicationDeadline: ""
            });

            navigate("/dashboard/myjobs");

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error creating job");
        }
    }

    return (
        <div className="max-w-6xl m-auto p-4 sm:p-2">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">Create New Job</h2>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 sm:p-8 space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInput}
                        rows="4"
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>


                {/* Requirements */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>

                    <div className="flex gap-2">
                        <input
                            value={reqInput}
                            onChange={(e) => setReqInput(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addRequirement}
                            className="bg-blue-600 text-white px-3 rounded"
                        >
                            <FaPlusCircle />
                        </button>
                    </div>

                    <div className="flex flex-row flex-wrap gap-2 mt-2">
                        {formData.requirements.map((item, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeRequirement(index)}
                                    className="ml-2 text-red-500"
                                >
                                    <FaTimes />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>


                {/* Responsibilities */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>

                    <div className="flex gap-2">
                        <input
                            value={resInput}
                            onChange={(e) => setResInput(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="button" onClick={addResponsibility} className="bg-blue-600 text-white px-3 rounded"><FaPlusCircle /></button>
                    </div>

                    <div className="flex flex-row flex-wrap gap-2 mt-2">
                        {formData.responsibilities.map((item, index) => (
                            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                                {item}
                                <button type="button" onClick={() => removeResponsibility(index)} className="ml-2 text-red-500"><FaTimes /></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* jobType */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleInput}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInput}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* locationa and positions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInput}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Positions</label>
                        <input
                            type="number"
                            name="positions"
                            value={formData.positions}
                            onChange={handleInput}
                            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>

                    <div className="flex gap-4 flex-wrap">
                        {experienceOptions.map((item) => (
                            <label key={item} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    onChange={() => handleExperienceChange(item)}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleInput}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md flex justify-center items-center gap-2"><FaPlusCircle /> Create Job</button>

            </form>
        </div>
    )
}

export default CreateJobs;