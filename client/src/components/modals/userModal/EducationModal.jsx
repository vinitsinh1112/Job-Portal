import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EducationModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [education, setEducation] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData?.education) {
            setEducation(modalData.education);
        }
        setHydrated(true);
    }, [modalData]);

    const handleEducation = () => {
        const newEducation = {
            qualification: "",
            institute: "",
            yearOfCompletion: "",
            score: ""
        };

        setEducation([...education, newEducation])
    }

    const HandleRemoveEducation = (index) => {
        const updated = education.filter((_, i) => i !== index);
        setEducation(updated);
    }

    const handleInputChange = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
    }

    const handleSaveEducation = async () => {
        try {

            setIsSaving(true);

            const res = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                { education },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (modalData?.setUser) {
                modalData.setUser(res.data.user);
            }

            toast.success("Updated successfully");
            closeModal();

        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    }

    if (!hydrated) return null;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 border-b">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Edit Education
                </h2>
            </div>

            <div className="flex flex-col gap-8 px-4 py-4 overflow-y-auto flex-1">

                {/* Existing Education */}
                {education.map((edu, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-4 sm:p-5 shadow-md flex flex-col gap-4 relative"
                    >

                        {/* remove button */}
                        <button
                            onClick={() => HandleRemoveEducation(index)}
                            className="absolute top-3 right-3 p-0.5 rounded-full text-white
                            bg-gradient-to-r from-red-500 to-rose-600
                            hover:from-red-600 hover:to-rose-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Education {index + 1}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Qualification */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Qualification
                                </label>
                                <input
                                    type="text"
                                    value={edu.qualification}
                                    onChange={(e) => handleInputChange(index, "qualification", e.target.value)}
                                    placeholder="Enter qualification"
                                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Institute */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Institute
                                </label>
                                <input
                                    type="text"
                                    value={edu.institute}
                                    onChange={(e) => handleInputChange(index, "institute", e.target.value)}
                                    placeholder="Enter university"
                                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Year */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Year of Completion
                                </label>
                                <input
                                    type="number"
                                    value={edu.yearOfCompletion}
                                    onChange={(e) => handleInputChange(index, "yearOfCompletion", e.target.value)}
                                    placeholder="Enter completion year"
                                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Score */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Score
                                </label>
                                <input
                                    type="text"
                                    value={edu.score}
                                    onChange={(e) => handleInputChange(index, "score", e.target.value)}
                                    placeholder="Enter score"
                                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                    </div>
                ))}

                <div className='flex flex-col gap-4'>
                    <button
                        onClick={handleEducation}
                        className="text-white px-5 py-2.5 w-full text-center rounded-md flex items-center justify-center gap-2 text-sm sm:text-base
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FaPlusCircle /> Add Education
                    </button>

                    <button
                        onClick={handleSaveEducation}
                        disabled={isSaving}
                        className={`text-white px-6 py-2.5 rounded-md font-medium w-full text-center transition-all duration-300 shadow-sm
                    ${isSaving
                                ? "bg-gray-400 cursor-not-allowed opacity-70"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-md active:scale-95"
                            }`}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default EducationModal