import axios from 'axios';
import React, { useState } from 'react'
import { IoDocumentTextSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';

const ResumeModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [resumeFile, setResumeFile] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    }

    const handleSaveResume = async () => {

        if (!resumeFile) {
            return toast.error("Please select a file");
        }

        try {

            setIsSaving(true);

            const formData = new FormData();
            formData.append("resume", resumeFile);

            const res = await axios.patch(`${backendUrl}/api/users/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (modalData?.setUser) {
                modalData.setUser(res.data.user);
            }

            toast.success("Resume updated sucessfully");
            closeModal();

        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 border-b">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Update Resume
                </h2>
            </div>

            <div className="flex flex-col gap-5 px-4 py-4 overflow-y-auto">

                {modalData?.resume && (
                    <div className="border rounded-lg p-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div className="flex items-center gap-3">

                            <div className="bg-blue-100 text-blue-600 p-2 rounded-md">
                                <IoDocumentTextSharp />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-800 break-all">
                                    {modalData.resumeName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Current uploaded resume
                                </p>
                            </div>

                        </div>

                    </div>
                )}

                <div className="flex flex-col gap-2">

                    <label className="text-sm font-medium text-gray-700">
                        Upload New Resume
                    </label>

                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="border rounded-md px-3 py-2 w-full text-sm sm:text-base
                        file:mr-3 file:px-3 file:py-1 file:border-0 file:text-white file:rounded-md file:text-sm
                        file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
                        file:hover:from-blue-600 file:hover:to-indigo-700
                        file:transition-all file:duration-300 file:shadow-sm file:hover:shadow-md
                        file:active:scale-95"
                    />

                    <p className="text-xs text-gray-500">
                        Accepted format: PDF, DOC, DOCX
                    </p>

                    {resumeFile && (
                        <p className="text-sm text-green-600 break-all">
                            Selected: {resumeFile.name}
                        </p>
                    )}

                </div>


                <button
                    onClick={handleSaveResume}
                    disabled={isSaving}
                    className={`text-white px-6 py-2.5 rounded-md font-medium w-full sm:w-auto transition-all duration-300 shadow-sm
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

export default ResumeModal