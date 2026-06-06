import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const EditAboutModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [bio, setBio] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            setBio(modalData.bio || "");
        }
    }, [modalData]);


    const handleSaveAbout = async (e) => {
        e.preventDefault();
        try {

            setIsSaving(true)

            const response = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                { bio: bio },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            modalData.setUser((prev) => ({
                ...prev,
                bio: bio
            }));

            console.log(response.data);
            toast.success("Updated Successfully");
            closeModal();

        } catch (error) {
            console.log(error);
            toast.error("Failed to update about");
        } finally {
            setIsSaving(false);
        }
    }


    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">

            <div className="sticky top-0 z-20 bg-gray-200 px-4 border-b flex justify-between items-center">
                <h2 className='text-lg sm:text-xl font-semibold'>Edit About</h2>

            </div>

            <form className='flex flex-col gap-4 px-4 py-4 overflow-y-auto' onSubmit={handleSaveAbout}>

                <div className='flex flex-col gap-2'>
                    <label className="text-sm font-medium text-gray-700">Bio</label>

                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={8}
                        className="border rounded-md px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-justify text-sm sm:text-base"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className={`text-white px-6 py-2.5 rounded-md font-medium w-full sm:w-auto transition-all duration-300 shadow-sm
                    ${isSaving
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-md active:scale-95"
                        }`}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>

            </form>

        </div>
    )
}

export default EditAboutModal;