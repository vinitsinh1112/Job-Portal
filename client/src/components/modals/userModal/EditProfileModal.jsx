import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditProfileModal = ({ modalData, closeModal }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [image, setImage] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            setName(modalData.name || "");
            setPhone(modalData.phone || "");
            setPreviewImage(modalData.profileImage || null);
        }
    }, [modalData]);

    const handleInputChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(null);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        try {

            setIsSaving(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("phone", phone);

            if (image) {
                formData.append("profileImage", image);
            }

            const res = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            modalData.setUser(res.data.user);
            toast.success("Updated successfully");
            closeModal();

        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            console.log(error);

        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">

            <div className="sticky top-0 z-20 bg-gray-200 px-4  border-b">
                <h2 className='text-lg sm:text-xl font-semibold'>
                    Edit Profile
                </h2>
            </div>

            <form className='flex flex-col gap-4 px-4 py-4' onSubmit={handleSaveProfile}>

                {/* IMAGE SECTION */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>

                    <div className='w-22 h-24 border rounded-md flex items-center justify-center overflow-hidden bg-gray-100 mx-auto sm:mx-0'>
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt='Profile'
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <span className='text-gray-400 text-sm'>No Image</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-2 w-full items-center sm:items-start text-center sm:text-left'>

                        <label className='text-sm font-medium'>
                            Profile Image
                        </label>

                        {previewImage && (
                            <button
                                type='button'
                                onClick={handleRemoveImage}
                                className="px-2 py-1 text-white flex items-center gap-1 text-sm rounded-md w-fit mx-auto sm:mx-0
                                bg-gradient-to-r from-red-500 to-rose-600
                                hover:from-red-600 hover:to-rose-700
                                transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                            >
                                Remove <FaTimes />
                            </button>
                        )}

                        {/* image upload */}
                        <label className="w-full sm:w-auto cursor-pointer">
                            <div className="px-4 py-2 text-white rounded-md text-sm w-full sm:w-auto text-center
                            bg-gradient-to-r from-blue-500 to-indigo-600
                            hover:from-blue-600 hover:to-indigo-700
                            transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
                                Choose Image
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="hidden"
                            />
                        </label>

                    </div>
                </div>

                {/* NAME */}
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* PHONE */}
                <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className={`text-white px-6 py-2.5 rounded-md font-medium w-full text-center transition-all duration-300 shadow-sm
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

export default EditProfileModal;