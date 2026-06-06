import React, { useEffect, useState } from 'react'
import { MdEdit, MdLocalPhone } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import axios from "axios";
import { toast } from 'react-toastify';
import { useModal } from '../context/modalContext';
import { FaPlusCircle } from 'react-icons/fa';


const Profile = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiFeedback, setAiFeedback] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const { openModal } = useModal();


    useEffect(() => {
        // fetch user data from backend
        const fetchUserdata = async () => {
            try {

                const response = await axios.get(`${backendUrl}/api/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                if (response) {
                    setUser(response.data.user);
                }

            } catch (error) {
                toast.error(error.response?.data?.message);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserdata();

    }, [token]);


    const handleAnalyzeResume = async () => {
        try {
            setAiLoading(true);

            const res = await axios.post(`${backendUrl}/api/ai/resume-review`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAiFeedback(res.data.feedback);
            setShowFeedback(true); // ensures it opens after analyze

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setAiLoading(false);
        }
    }

    const Skeleton = ({ className }) => {
        return (
            <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6 p-2">

                {/* Title */}
                <Skeleton className="h-6 w-40" />

                {/* Profile Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border flex gap-4 items-center">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-52" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>

                {/* About Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>

                {/* Skills Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 flex-wrap">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                </div>

                {/* Education Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                </div>

                {/* Internship Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>

                {/* Projects Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>

                {/* Resume Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                </div>

            </div>
        );
    }

    if (!user) return <div className='p-6'>User not found.</div>

    return (
        <div className='space-y-6'>
            <h1 className='text-2xl font-semibold'>My Profile</h1>

            {/* profile card */}
            <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                <button
                    onClick={() =>
                        openModal("editProfile", {
                            name: user?.name,
                            profileImage: user?.profileImage,
                            phone: user?.phone,
                            setUser
                        })
                    }
                    className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                >
                    <MdEdit />
                </button>

                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>

                    {/* Avtar */}
                    <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold'>
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt='profile-photo' className='w-full h-full object-fill' />
                        ) : (
                            <span className='text-xl font-bold'>{user?.name?.charAt(0)}</span>
                        )}
                    </div>

                    {/* info */}
                    <div>
                        <div className='flex items-center gap-3'>
                            <h2 className='text-xl font-semibold text-gray-800'>{user.name}</h2>
                            <span className='text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700'>{user.role}</span>
                        </div>

                        <p className='text-gray-500 flex items-center gap-2'><IoMdMail />{user.email}</p>
                        <p className='text-gray-500 flex items-center gap-2'><MdLocalPhone />{user.phone || "Add phone No."}</p>

                    </div>

                </div>
            </div>

            {/* About card */}
            <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                <button
                    onClick={() =>
                        openModal("editAbout", {
                            bio: user?.bio,
                            setUser
                        })
                    }
                    className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                >
                    <MdEdit />
                </button>

                <h2 className='text-lg font-semibold text-gray-800 mb-2'>About</h2>
                <p className='text-gray-600 text-md leading-relaxed'>{user.bio || "Add bio"}</p>

            </div>

            {user.role === "recruiter" ? (
                <>
                    {/* Company card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border relative">

                        {/* Edit Button */}
                        <button
                            onClick={() =>
                                openModal("editCompany", {
                                    companyName: user?.companyName,
                                    companyLogo: user?.companyLogo,
                                    companyWebsite: user?.companyWebsite,
                                    companyDescription: user?.companyDescription,
                                    setUser

                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Company</h2>

                        <div className="flex flex-col gap-4">

                            {/* Top Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                                {/* Logo */}
                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 border rounded-lg flex items-center justify-center">
                                    {user.companyLogo ? (
                                        <img
                                            src={user.companyLogo}
                                            alt="company-logo"
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-gray-500 font-semibold text-2xl">
                                            {user.companyName ? user.companyName.charAt(0) : "C"}
                                        </span>
                                    )}
                                </div>

                                {/* Name + Website */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {user.companyName || "Add Company Name"}
                                    </h3>

                                    {user.companyWebsite && (
                                        <a
                                            href={user.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                                        >
                                            {user.companyWebsite}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t"></div>

                            {/* Description Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-500 mb-2">Description</h3>

                                <p className="text-gray-600 text-md leading-relaxed">
                                    {user.companyDescription || "Add Description"}
                                </p>
                            </div>

                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/*Skills & Languages Card */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                        <button
                            onClick={() =>
                                openModal("editSkillsAndLangs", {
                                    skills: user?.skills || [],
                                    languages: user?.languages || [],
                                    setUser
                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>

                        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Skills & Languages</h2>

                        <div className='mb-5'>
                            <h3 className='text-sm font-medium text-gray-500 mb-2'>Skills :</h3>

                            <div className='flex flex-wrap gap-2'>
                                {user.skills?.length > 0 ? (
                                    user.skills.map((skill, index) => (
                                        <span key={index} className='px-2 py-1 bg-gray-200 text-gray-700 rounded-sm text-xs'>{skill}</span>
                                    ))
                                ) : (
                                    <p className='text-gray-400 text-sm'>No Skills added</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className='text-sm font-medium text-gray-500 mb-2'>Languages :</h3>

                            <div className='flex flex-wrap gap-2'>
                                {user.languages?.length > 0 ? (
                                    user.languages.map((language, index) => (
                                        <span key={index} className='px-2 py-1 bg-gray-200 text-gray-700 rounded-sm text-xs'>{language}</span>
                                    ))
                                ) : (
                                    <p className='text-gray-400 text-sm'>Add Skills and Languages</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/*Education Card */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                        <button
                            onClick={() =>
                                openModal("editEducation", {
                                    education: user.education || [],
                                    setUser
                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>

                        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Education</h2>

                        <div className='space-y-4'>
                            {user.education?.length > 0 ? (
                                user.education?.map((edu, index) => (
                                    <div key={index} className='border-2 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                                        <div>
                                            <p className='font-medium text-gray-800'>{edu.qualification}</p>
                                            <p className='text-sm text-gray-600 mb-1'>{edu.institute}</p>
                                            <p className='text-xs text-gray-500 mb-1'>Year: {edu.yearOfCompletion}</p>
                                            <p className='text-xs text-gray-500'>Score : {edu.score}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-400'>Add Education</p>
                            )}
                        </div>

                    </div>

                    {/*Internships Card */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                        <button
                            onClick={() =>
                                openModal("editInternship", {
                                    internships: user.internships || [],
                                    setUser
                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>

                        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Internships</h2>

                        <div className='space-y-4'>
                            {user.internships?.length > 0 ? (
                                user.internships?.map((internship, index) => (
                                    <div key={index} className='border-2 rounded-lg p-4 flex flex-col gap-2'>

                                        {/* top row */}
                                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1'>
                                            <p className='font-medium text-gray-800'>{internship.title}</p>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(internship.startDate).toLocaleDateString()} - {internship.endDate ? new Date(internship.endDate).toLocaleDateString() : "Present"}
                                            </p>
                                        </div>

                                        <p className='text-sm text-gray-500'>Company : {internship.companyName}</p>
                                        <p className='text-sm text-gray-500'>Description : {internship.description}</p>

                                        <div className='flex flex-wrap gap-2 mt-1'>
                                            <p className='text-sm text-gray-500'>Skills :</p>
                                            {internship.skills?.map((skill, i) => (
                                                <span key={i} className='px-2 py-1 text-xs bg-gray-200 rounded'>{skill}</span>
                                            ))}
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-400'>Add Internships</p>
                            )}

                        </div>
                    </div>

                    {/*Projects Card */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                        <button
                            onClick={() =>
                                openModal("editProject", {
                                    projects: user.projects || [],
                                    setUser
                                })
                            }
                            className='absolute top-4 right-4 p-1 rounded text-gray-700 text-md hover:bg-gray-200 flex items-center gap-1'
                        >
                            <MdEdit />
                        </button>

                        <h2 className='text-lg font-semibold text-gray-800 mb-3'>Projects</h2>

                        <div className='space-y-4'>
                            {user.projects?.length > 0 ? (
                                user.projects?.map((project, index) => (
                                    <div key={index} className='border-2 rounded-lg p-4 flex flex-col gap-2'>

                                        {/* top row */}
                                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1'>
                                            <p className='font-medium text-gray-800'>{project.projectName}</p>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Present"}
                                            </p>
                                        </div>

                                        <p className='text-sm text-gray-500'>Description : {project.description}</p>
                                        <a href={project.projectUrl} target='_blank' className='text-sm text-blue-600 hover:underline w-fit cursor-pointer'>View Project</a>

                                        <div className='flex flex-wrap gap-2 mt-1'>
                                            <p className='text-sm text-gray-500'>Skills :</p>
                                            {project.skills?.map((skill, i) => (
                                                <span key={i} className='px-2 py-1 text-xs bg-gray-200 rounded'>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-400'>Add Projects</p>
                            )}
                        </div>
                    </div>

                    {/* RESUME CARD */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border relative'>

                        <h2 className='text-lg font-semibold text-gray-800 mb-4'>Resume</h2>

                        {user.resume ? (
                            <>
                                {/* Edit Button */}
                                <button
                                    onClick={() =>
                                        openModal("editResume", {
                                            resume: user?.resume,
                                            resumeName: user?.resumeName,
                                            setUser
                                        })
                                    }
                                    className="absolute top-4 right-4 p-2 rounded hover:bg-gray-200"
                                >
                                    <MdEdit />
                                </button>

                                {/* Resume Info */}
                                <div>
                                    <p className='text-gray-800 font-medium'>
                                        {user.resumeName}
                                    </p>

                                    <p className='text-xs text-gray-400 mt-1'>
                                        Uploaded: {new Date(user.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">

                                    <a
                                        href={user.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-3 py-1.5 rounded-md text-white 
                                        bg-gradient-to-r from-blue-500 to-indigo-600 
                                        hover:from-blue-600 hover:to-indigo-700 
                                        transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        View
                                    </a>

                                    <a
                                        href={user.resume}
                                        download={user.resume.split("/").pop()}
                                        className="text-xs px-3 py-1.5 rounded-md text-white 
                                        bg-gradient-to-r from-green-500 to-emerald-600 
                                        hover:from-green-600 hover:to-emerald-700 
                                        transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        Download
                                    </a>

                                    <button
                                        onClick={handleAnalyzeResume}
                                        disabled={aiLoading}
                                        className={`text-xs px-3 py-1.5 rounded-md text-white transition-all duration-300 shadow-sm
                                        ${aiLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 hover:shadow-md active:scale-95"
                                            }`}
                                    >
                                        {aiLoading ? "Analyzing..." : "Analyze"}
                                    </button>

                                </div>

                                {/* AI FEEDBACK */}
                                {aiFeedback && (
                                    <div className="mt-3 w-full">

                                        <button
                                            onClick={() => setShowFeedback(!showFeedback)}
                                            className="text-xs text-purple-600 hover:underline"
                                        >
                                            {showFeedback ? "Hide AI Feedback" : "Show AI Feedback"}
                                        </button>

                                        {showFeedback && (
                                            <div className="mt-2 p-3 border rounded-lg bg-gray-50 w-full">
                                                <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                                                    {aiFeedback}
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                )}

                            </>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-sm">No resume uploaded</p>

                                <button
                                    onClick={() =>
                                        openModal("editResume", {
                                            resume: user?.resume,
                                            setUser
                                        })
                                    }
                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
                                >
                                    <FaPlusCircle /> Add Resume
                                </button>
                            </div>
                        )}

                    </div>
                </>
            )}

        </div>
    )
}


export default Profile
