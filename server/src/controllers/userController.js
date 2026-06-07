import AsyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import httpStatus from "http-status";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// get user profile
const getUserProfile = AsyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    res.status(httpStatus.OK).json({
        success: true,
        user
    });
});


// Update user profile
const updateUserProfile = AsyncHandler(async (req, res) => {
    const {
        name,
        bio,
        phone,
        skills,
        education,
        languages,
        internships,
        projects,
        competitiveExams,

        companyName,
        companyDescription,
        companyWebsite,
    } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    // name bio phone
    if (name) { user.name = name; }
    if (bio) { user.bio = bio; }
    if (phone) { user.phone = phone; }

    // for user
    if (user.role === "user") {
        // skills
        if (skills && Array.isArray(skills)) {
            user.skills = skills;
        }

        // languages
        if (languages && Array.isArray(languages)) {
            user.languages = languages;
        }

        // education
        if (education) {
            user.education = education;
        }

        // internships
        if (internships) {
            user.internships = internships;
        }

        // projects
        if (projects) {
            user.projects = projects;
        }

        // Competitive Exams
        if (competitiveExams) {
            user.competitiveExams = competitiveExams;
        }
        // upload resume
        if (req.files?.resume) {
            const file = req.files.resume[0];

            user.resume = await uploadToCloudinary(
                file.buffer,
                "Job-portal/resumes"
            );

            user.resumeName = file.originalname;
        }
    }

    // for recruiter
    if (user.role === "recruiter") {
        // company name
        if (companyName) {
            user.companyName = companyName;
        }

        // company description
        if (companyDescription) {
            user.companyDescription = companyDescription;
        }

        // company website
        if (companyWebsite) {
            user.companyWebsite = companyWebsite;
        }

        // company logo
        if (req.files?.companyLogo) {
            const file = req.files.companyLogo[0];

            user.companyLogo = await uploadToCloudinary(
                file.buffer,
                "Job-portal/company-logos"
            );
        }
    }


    // upload profile-image
    if (req.files?.profileImage) {
        const file = req.files.profileImage[0];

        user.profileImage = await uploadToCloudinary(
            file.buffer,
            "Job-portal/profile-images"
        );
    }

    const updatedUser = await user.save();

    res.status(httpStatus.OK).json({
        message: "Profile updated successfully",
        user: updatedUser,
    });

});


export { getUserProfile, updateUserProfile };
