import React, { useEffect, useState } from 'react'
import { MdLocalPhone } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const UserDetails = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");
    const { id } = useParams();

    const [user, setUser] = useState(null);

    const getUserDetails = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(response.data.user);

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    if (!user) {
        return (
            <div className='flex justify-center items-center h-[70vh]'>
                <p className='text-lg font-medium text-gray-500'>Loading...</p>
            </div>
        )
    }

    return (
        <div className='space-y-6'>

            <h1 className='text-2xl font-semibold'>My Profile</h1>

            {/* PROFILE */}
            <div className='bg-white p-4 rounded-xl shadow-sm border'>

                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>

                    <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold overflow-hidden'>
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt='profile'
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <span>{user.name?.charAt(0)}</span>
                        )}
                    </div>

                    <div>
                        <div className='flex items-center gap-4'>
                            <h2 className='text-xl font-semibold text-gray-800'>
                                {user.name}
                            </h2>
                            <span className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-sm capitalize'>
                                {user.role}
                            </span>
                        </div>

                        <p className='text-gray-500 flex items-center gap-2 text-sm'>
                            <IoMdMail />
                            {user.email}
                        </p>

                        <p className='text-gray-500 flex items-center gap-2 text-sm'>
                            <MdLocalPhone />
                            {user.phone || "No phone added"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ABOUT */}
            <div className='bg-white p-4 rounded-xl shadow-sm border'>
                <h2 className='text-lg font-semibold mb-2'>About</h2>
                <p className='text-gray-600'>
                    {user.bio || "No bio added"}
                </p>
            </div>

            {/* RECRUITER VIEW */}
            {user.role === "recruiter" ? (
                <div className='bg-white p-5 rounded-xl shadow-sm border'>

                    <h2 className='text-xl font-semibold mb-4'>Company</h2>

                    <div className='flex items-center gap-4'>

                        <div className='w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg'>
                            {user.companyLogo ? (
                                <img src={user.companyLogo} className='w-full h-full object-contain' />
                            ) : (
                                <span>{user.companyName?.charAt(0) || "C"}</span>
                            )}
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold'>
                                {user.companyName || "No company"}
                            </h3>

                            {user.companyWebsite && (
                                <a
                                    href={user.companyWebsite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='text-blue-600 text-sm hover:underline'
                                >
                                    {user.companyWebsite}
                                </a>
                            )}
                        </div>
                    </div>

                    <p className='text-gray-600 mt-4'>
                        {user.companyDescription || "No description"}
                    </p>
                </div>
            ) : (
                <>
                    {/* SKILLS */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Skills</h2>

                        <div className='flex flex-wrap gap-2'>
                            {(user.skills || []).length > 0 ? (
                                user.skills.map((s, i) => (
                                    <span key={i} className='px-2 py-1 bg-gray-200 rounded text-xs'>
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <p className='text-gray-400 text-sm'>No skills added</p>
                            )}
                        </div>
                    </div>

                    {/* LANGUAGES */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Languages</h2>

                        <div className='flex flex-wrap gap-2'>
                            {(user.languages || []).length > 0 ? (
                                user.languages.map((l, i) => (
                                    <span key={i} className='px-2 py-1 bg-gray-200 rounded text-xs'>
                                        {l}
                                    </span>
                                ))
                            ) : (
                                <p className='text-gray-400 text-sm'>No languages added</p>
                            )}
                        </div>
                    </div>

                    {/* EDUCATION */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Education</h2>

                        {(user.education || []).length > 0 ? (
                            user.education.map((e, i) => (
                                <div key={i} className='border p-3 rounded mb-2'>
                                    <p className='font-medium'>{e.qualification}</p>
                                    <p className='text-sm text-gray-600'>{e.institute}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-400'>No education added</p>
                        )}
                    </div>

                    {/* INTERNSHIPS */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Internships</h2>

                        {(user.internships || []).length > 0 ? (
                            user.internships.map((inr, i) => (
                                <div key={i} className='border p-3 rounded mb-2'>
                                    <p className='font-medium'>{inr.title}</p>
                                    <p className='text-sm text-gray-600'>{inr.companyName}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-400'>No internships added</p>
                        )}
                    </div>

                    {/* PROJECTS */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Projects</h2>

                        {(user.projects || []).length > 0 ? (
                            user.projects.map((p, i) => (
                                <div key={i} className='border p-3 rounded mb-2'>
                                    <p className='font-medium'>{p.projectName}</p>
                                    <p className='text-sm text-gray-600'>{p.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-400'>No projects added</p>
                        )}
                    </div>

                    {/* RESUME (NO EDIT / ACTION BUTTONS) */}
                    <div className='bg-white p-4 rounded-xl shadow-sm border'>
                        <h2 className='text-lg font-semibold mb-3'>Resume</h2>

                        {user.resume ? (
                            <div>
                                <p className='font-medium'>
                                    {user.resumeName || "Resume"}
                                </p>

                                <p className='text-xs text-gray-400 mt-1'>
                                    Uploaded: {new Date(user.updatedAt).toLocaleDateString()}
                                </p>

                                <a
                                    href={user.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='inline-block mt-3 text-blue-600 text-sm hover:underline'
                                >
                                    View Resume
                                </a>
                            </div>
                        ) : (
                            <p className='text-gray-400'>No resume uploaded</p>
                        )}
                    </div>
                </>
            )}

        </div>
    )
}

export default UserDetails