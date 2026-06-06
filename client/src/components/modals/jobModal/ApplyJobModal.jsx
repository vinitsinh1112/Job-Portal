import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ApplyJobModal = ({ modalData, closeModal }) => {

    if (!modalData) return null;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const token = localStorage.getItem("token");
    const { jobId, setApplied } = modalData;

    const [currentUser, setCurrentUser] = useState(null);
    const [userProfileResume, setUserProfileResume] = useState(true);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch latest user (with resume)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${backendUrl}/api/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCurrentUser(res.data.user);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load user data");
            }
        };

        fetchUser();
    }, [token]);

    // ✅ Apply handler
    const handleApply = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            // ❌ Prevent empty upload case
            if (!userProfileResume && !file) {
                toast.error("Please upload a resume");
                setLoading(false);
                return;
            }

            // ✅ Only send file if user selected new resume
            if (!userProfileResume && file) {
                formData.append("resume", file);
            }

            // 🔍 Debug (remove later)
            console.log("file:", file);
            console.log("using profile:", userProfileResume);

            await axios.post(
                `${backendUrl}/api/applications/apply/${jobId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success("Applied successfully");

            if (setApplied) setApplied(true);

            closeModal();

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md sm:max-w-2xl">

            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Apply for this job
            </h2>

            {/* ✅ Option 1: Profile Resume */}
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
                <input
                    type="radio"
                    checked={userProfileResume}
                    onChange={() => {
                        setUserProfileResume(true);
                        setFile(null); // 🔥 FIX: reset file
                    }}
                    className="mt-1"
                />
                <div>
                    <p className="text-sm font-medium">
                        Use resume from profile
                    </p>

                    {currentUser === null ? (
                        <p className="text-xs text-gray-400">
                            Loading...
                        </p>
                    ) : currentUser?.resume ? (
                        <a
                            href={currentUser.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            View current resume
                        </a>
                    ) : (
                        <p className="text-xs text-gray-400">
                            No resume found in profile
                        </p>
                    )}
                </div>
            </label>

            {/* ✅ Option 2: Upload Resume */}
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                    type="radio"
                    checked={!userProfileResume}
                    onChange={() => {
                        setUserProfileResume(false);
                    }}
                />
                <span className="text-sm font-medium">
                    Upload new resume
                </span>
            </label>

            {!userProfileResume && (
                // <input
                //     type="file"
                //     accept=".pdf,.doc,.docx"
                //     onChange={(e) => {
                //         setFile(e.target.files[0]);
                //         setUserProfileResume(false); // 🔥 FIX: ensure correct mode
                //     }}
                //     className="w-full border rounded-md p-2 text-sm"
                // />

                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                        setUserProfileResume(false);
                    }}
                    className="border rounded-md px-3 py-2 w-full text-sm sm:text-base
                    file:mr-3 file:px-3 file:py-1 file:border-0 file:text-white file:rounded-md file:text-sm
                    file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
                    file:hover:from-blue-600 file:hover:to-indigo-700
                    file:transition-all file:duration-300 file:shadow-sm file:hover:shadow-md
                    file:active:scale-95"
                />


            )}



            {/* ✅ Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-5">
                <button
                    onClick={closeModal}
                    className="w-full sm:w-auto px-4 py-2 rounded-md text-white text-sm
                    bg-gradient-to-r from-red-500 to-rose-600
                    hover:from-red-600 hover:to-rose-700
                    transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                    Cancel
                </button>

                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="px-4 py-2 rounded-md text-white text-sm bg-gradient-to-r from-blue-500 to-indigo-600 
                    hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Applying..." : "Apply"}
                </button>

            </div>

        </div>
    );
};

export default ApplyJobModal;