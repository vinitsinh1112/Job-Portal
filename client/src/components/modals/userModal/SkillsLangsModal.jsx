import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SkillsLangsModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [skillInput, setSkillInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            setSkills(modalData.skills || []);
            setLanguages(modalData.languages || []);
        }
    }, [modalData]);

    const handleAddSkill = () => {
        const newSkill = skillInput.trim();
        if (!newSkill) return;
        if (skills.includes(newSkill)) return;
        setSkills([...skills, newSkill]);
        setSkillInput("");
    }

    const handleRemoveSkill = (index) => {
        const updateSkills = skills.filter((_, i) => i !== index);
        setSkills(updateSkills);
    }

    const handleAddLanguage = () => {
        const newLanguage = languageInput.trim();
        if (!newLanguage) return;
        if (languages.includes(newLanguage)) return;
        setLanguages([...languages, newLanguage]);
        setLanguageInput("");
    }

    const handleRemoveLanguage = (index) => {
        const updateLanguages = languages.filter((_, i) => i !== index);
        setLanguages(updateLanguages);
    }

    const handleSave = async (e) => {

        e.preventDefault();

        try {

            setIsSaving(true);

            const res = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                { skills, languages },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (modalData?.setUser) {
                modalData.setUser(res.data.user);
            }

            toast.success("Updated successfully");
            closeModal();

        } catch (error) {
            console.log(error);
            toast.error("Failed to update");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 border-b">
                <h2 className='text-lg sm:text-xl font-semibold'>
                    Edit Skills & Languages
                </h2>
            </div>

            <div className="flex flex-col gap-6 px-4 py-4 overflow-y-auto">

                {/* Skills Section */}
                <div className='flex flex-col gap-3'>

                    <h3 className='text-sm sm:text-md font-semibold text-gray-800'>
                        Skills
                    </h3>

                    <div className='flex flex-wrap gap-2'>
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm max-w-full'
                            >
                                <span className="break-words">{skill}</span>
                                <button onClick={() => handleRemoveSkill(index)} className='text-red-500'>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type='text'
                        placeholder='Add a skill'
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className='border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button
                        onClick={handleAddSkill}
                        className='py-2.5 rounded-md flex items-center justify-center gap-2 text-white text-sm sm:text-base         
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95'
                    >
                        <FaPlusCircle /> Add Skill
                    </button>

                </div>

                {/* Languages section */}
                <div className='flex flex-col gap-3'>

                    <h3 className='text-sm sm:text-md font-semibold text-gray-800'>
                        Languages
                    </h3>

                    <div className='flex flex-wrap gap-2'>
                        {languages.map((language, index) => (
                            <div
                                key={index}
                                className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm max-w-full'
                            >
                                <span className="break-words">{language}</span>
                                <button onClick={() => handleRemoveLanguage(index)} className='text-red-500'>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type='text'
                        placeholder='Add a language'
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        className='border rounded-md px-3 py-2 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button
                        onClick={handleAddLanguage}
                        className='py-2.5 rounded-md flex items-center justify-center gap-2 text-white text-sm sm:text-base         
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95'
                    >
                        <FaPlusCircle /> Add Language
                    </button>

                </div>

                <button
                    onClick={handleSave}
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
    )
}

export default SkillsLangsModal