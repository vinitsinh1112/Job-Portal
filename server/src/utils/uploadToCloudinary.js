import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath, folder) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: folder
    });

    return result.secure_url;
}

export default uploadToCloudinary;