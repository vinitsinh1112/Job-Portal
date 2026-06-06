import React, { useEffect, useState } from "react";
import { FaTimes, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const InternshipModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [internships, setInternships] = useState([]);
    const [skillInput, setSkillInput] = useState({});
    const [hydrated, setHydrated] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData?.internships) {
            setInternships(modalData.internships);
        }
        setHydrated(true);
    }, [modalData]);

    const handleAddInternship = () => {
        const newInternship = {
            title: "",
            companyName: "",
            startDate: "",
            endDate: "",
            description: "",
            skills: []
        };

        setInternships([...internships, newInternship]);
    };

    const handleRemoveInternship = (index) => {
        const updated = internships.filter((_, i) => i !== index);
        setInternships(updated);
    };

    const handleInputChange = (index, field, value) => {

        const updated = [...internships];

        updated[index][field] = value;

        setInternships(updated);
    };

    const handleSkillInputChange = (index, value) => {

        setSkillInput({
            ...skillInput,
            [index]: value
        });

    };

    const handleAddSkill = (index) => {

        const skill = skillInput[index]?.trim();

        if (!skill) return;

        const updated = [...internships];

        if (!updated[index].skills.includes(skill)) {
            updated[index].skills.push(skill);
        }

        setInternships(updated);

        setSkillInput({
            ...skillInput,
            [index]: ""
        });
    };

    const handleRemoveSkill = (internshipIndex, skillIndex) => {

        const updated = [...internships];

        updated[internshipIndex].skills =
            updated[internshipIndex].skills.filter((_, i) => i !== skillIndex);

        setInternships(updated);
    };

    const handleSaveInternships = async () => {

        try {

            setIsSaving(true);

            const res = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                { internships },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (modalData?.setUser) {
                modalData.setUser(res.data.user);
            }

            toast.success("Internships updated successfully");

            closeModal();

        } catch (error) {

            console.error(error);

            toast.error(error.response?.data?.message || "Update failed");

        } finally {
            setIsSaving(false);
        }
    };

    if (!hydrated) return null;

    return (

        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 border-b">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Edit Internship
                </h2>
            </div>

            <div className="flex flex-col gap-8 px-4 py-4 overflow-y-auto flex-1">

                {internships.map((internship, index) => (

                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-4 sm:p-5 shadow-md flex flex-col gap-4 relative"
                    >

                        <button
                            onClick={() => handleRemoveInternship(index)}
                            className="absolute top-3 right-3 p-0.5 rounded-full text-white
                            bg-gradient-to-r from-red-500 to-rose-600
                            hover:from-red-600 hover:to-rose-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Internship {index + 1}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={internship.title}
                                    onChange={(e) =>
                                        handleInputChange(index, "title", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Company</label>
                                <input
                                    type="text"
                                    value={internship.companyName}
                                    onChange={(e) =>
                                        handleInputChange(index, "companyName", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={internship.startDate?.split("T")[0] || ""}
                                    onChange={(e) =>
                                        handleInputChange(index, "startDate", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={internship.endDate?.split("T")[0] || ""}
                                    onChange={(e) =>
                                        handleInputChange(index, "endDate", e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={internship.description}
                                onChange={(e) =>
                                    handleInputChange(index, "description", e.target.value)
                                }
                                rows={5}
                                className="border rounded-md px-3 py-2 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">

                            <label className="text-sm font-medium text-gray-700">Skills</label>

                            <div className="flex flex-wrap gap-2">

                                {internship.skills?.map((skill, skillIndex) => (

                                    <div
                                        key={skillIndex}
                                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
                                    >

                                        <span>{skill}</span>

                                        <button
                                            onClick={() => handleRemoveSkill(index, skillIndex)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTimes size={14} />
                                        </button>

                                    </div>

                                ))}

                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">

                                <input
                                    type="text"
                                    value={skillInput[index] || ""}
                                    onChange={(e) =>
                                        handleSkillInputChange(index, e.target.value)
                                    }
                                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    onClick={() => handleAddSkill(index)}
                                    className="text-white px-5 py-2 rounded-md flex items-center gap-2 text-sm sm:text-base
                                    bg-gradient-to-r from-green-500 to-emerald-600
                                    hover:from-green-600 hover:to-emerald-700
                                    transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                >
                                    <FaPlusCircle /> Add
                                </button>

                            </div>

                        </div>

                    </div>

                ))}


                <div className="flex flex-col gap-5">
                    <button
                        onClick={handleAddInternship}
                        className="text-white px-5 py-2.5 w-full text-center rounded-md flex items-center justify-center gap-2 text-sm sm:text-base
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FaPlusCircle /> Add Internship
                    </button>

                    <button
                        onClick={handleSaveInternships}
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
    );
};

export default InternshipModal;