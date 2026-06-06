import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const CompanyModal = ({ modalData, closeModal }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            setCompanyName(modalData.companyName || "");
            setCompanyDescription(modalData.companyDescription || "");
            setCompanyWebsite(modalData.companyWebsite || "");

            setLogoPreview(modalData.companyLogo || null);
            setLogoFile(null);

        }
    }, [modalData]);

    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const handleSaveCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Company name is required");
            return;
        }

        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("companyName", companyName);
            formData.append("companyDescription", companyDescription);
            formData.append("companyWebsite", companyWebsite);

            if (logoFile) {
                formData.append("companyLogo", logoFile);
            }

            const res = await axios.patch(
                `${backendUrl}/api/users/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            modalData?.setUser?.(res.data.user);

            toast.success("Company updated successfully");
            closeModal();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 border-b flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold">
                    Edit Company
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
                {/* Logo Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4">

                    {/* Preview */}
                    {logoPreview ? (
                        <div className="relative">
                            <img
                                src={logoPreview}
                                alt="Company Logo Preview"
                                className="w-24 h-24 object-contain border bg-gray-500"
                            />

                            <button
                                onClick={handleRemoveLogo}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No logo selected</p>
                    )}

                    {/* File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="border p-2 rounded-md"
                    />


                </div>
                {/* Company Name */}
                <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        rows={6}
                        className="border rounded-md px-3 py-2 w-full resize-none"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="text-sm font-medium">Website</label>
                    <input
                        type="text"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="p-2">
                <button
                    onClick={handleSaveCompany}
                    disabled={isSaving}
                    className={`w-full py-2.5 rounded-md font-medium text-white transition-all duration-300
                        ${isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                        }`}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default CompanyModal;