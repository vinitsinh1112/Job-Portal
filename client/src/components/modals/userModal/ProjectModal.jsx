import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify';

const ProjectModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [projects, setProjects] = useState([]);
    const [skillInput, setSkillInput] = useState({});
    const [hydrated, setHydrated] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData?.projects) {
            setProjects(modalData.projects);
        }
        setHydrated(true);
    }, [modalData]);

    const handleAddProject = () => {

        const newProject = {
            projectName: "",
            description: "",
            startDate: "",
            endDate: "",
            projectUrl: "",
            skills: []
        }

        setProjects([...projects, newProject]);
    }

    const handleRemoveProject = (index) => {

        const updated = projects.filter((_, i) => i !== index);

        setProjects(updated);

    }

    const handleInputChange = (index, field, value) => {

        const updated = [...projects];

        updated[index][field] = value;

        setProjects(updated);

    }

    const handleSkillInputChange = (index, value) => {

        setSkillInput({
            ...skillInput,
            [index]: value
        });
    }

    const handleAddSkill = (index) => {

        const skill = skillInput[index]?.trim();

        if (!skill) return;

        const updated = [...projects];

        if (!updated[index].skills.includes(skill)) {
            updated[index].skills.push(skill);
        }

        setProjects(updated);

        setSkillInput({
            ...skillInput,
            [index]: ""
        });

    }

    const handleRemoveSkill = (index, skillIndex) => {

        const updated = [...projects];

        updated[index].skills = updated[index].skills.filter((_, i) => i !== skillIndex);

        setProjects(updated);

    }

    const handleSaveProjects = async () => {
        try {

            setIsSaving(true);

            const res = await axios.patch(`${backendUrl}/api/users/update-profile`,
                { projects },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (modalData?.setUser) {
                modalData.setUser(res.data.user);
            }

            toast.success("Updated Successfully");
            closeModal();

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);

        } finally {
            setIsSaving(false);
        }
    }

    if (!hydrated) return null;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 border-b">
                <h2 className='text-lg sm:text-xl font-semibold'>
                    Project
                </h2>
            </div>

            <div className="flex flex-col gap-8 px-4 py-4 overflow-y-auto flex-1">

                {projects.map((project, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg p-4 sm:p-5 shadow-md flex flex-col gap-4 relative'>

                        <button
                            onClick={() => handleRemoveProject(index)}
                            className="absolute top-3 right-3 p-0.5 rounded-full text-white
                            bg-gradient-to-r from-red-500 to-rose-600
                            hover:from-red-600 hover:to-rose-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Project {index + 1}
                        </h3>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    type="text"
                                    value={project.projectName}
                                    onChange={(e) => handleInputChange(index, "projectName", e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Project URL</label>
                                <input
                                    type="text"
                                    value={project.projectUrl}
                                    onChange={(e) => handleInputChange(index, "projectUrl", e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={project.startDate?.split("T")[0] || ""}
                                    onChange={(e) => handleInputChange(index, "startDate", e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={project.endDate?.split("T")[0] || ""}
                                    onChange={(e) => handleInputChange(index, "endDate", e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Description</label>

                            <textarea
                                value={project.description}
                                onChange={(e) => handleInputChange(index, "description", e.target.value)}
                                rows={4}
                                className="border rounded-md px-3 py-2 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Skills</label>

                            <div className="flex flex-wrap gap-2">
                                {project.skills?.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                                        <span>{skill}</span>
                                        <button
                                            onClick={() => handleRemoveSkill(index, i)}
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
                                    onChange={(e) => handleSkillInputChange(index, e.target.value)}
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


                <div className='flex flex-col gap-5'>
                    <button
                        onClick={handleAddProject}
                        className="text-white px-5 py-2.5 w-full text-center rounded-md flex items-center justify-center gap-2 text-sm sm:text-base
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FaPlusCircle /> Add Project
                    </button>

                    <button
                        onClick={handleSaveProjects}
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

export default ProjectModal;