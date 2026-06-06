import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import jobModel from '../models/jobModel.js';
import userModel from '../models/userModel.js';
import applicationModel from '../models/applicationModel.js';


const createJob = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        jobType,
        location,
        salary,
        experience,
        requirements,
        responsibilities,
        applicationDeadline,
        positions,
        createdBy
    } = req.body

    // validation
    if (!title || !description || !applicationDeadline) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Required fields are missing");
    }

    const recruiterId = req.user.id;

    const job = await jobModel.create({
        title,
        description,
        jobType,
        location,
        salary,
        experience,
        requirements,
        responsibilities,
        applicationDeadline,
        positions,
        createdBy: recruiterId,
    });

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Job created successfully",
        job
    });

});


const getAllJobs = asyncHandler(async (req, res) => {
    const { search = "", experience, jobType, page = 1, limit = 10 } = req.query

    const filter = {}

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { requirements: { $elemMatch: { $regex: search, $options: "i" } } },
            { location: { $regex: search, $options: "i" } },
        ];
    }


    if (experience) {
        filter.experience = experience;
    }

    if (jobType) {
        filter.jobType = jobType;
    }

    filter.status = "open";
    filter.isDeleted = false;

    const skip = (page - 1) * limit;

    const jobs = await jobModel
        .find(filter)
        .populate("createdBy", "companyName companyLogo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalJobs = await jobModel.countDocuments(filter);

    res.status(httpStatus.OK).json({
        success: true,
        totalJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        jobs
    });
});

// get single job details
const getJobDetails = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const job = await jobModel
        .findById(id)
        .populate("createdBy", "companyName companyLogo companyWebsite companyDescription")

    if (!job) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not exists");
    }

    if (job.isDeleted) {
        if (req.user.role === "recruiter" && job.createdBy._id.toString() === req.user.id.toString()) {
            return res.status(httpStatus.OK).json({
                success: true,
                job
            });
        }

        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not exists");
    }

    res.status(httpStatus.OK).json({
        success: true,
        job
    });
});

const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const job = await jobModel
        .findOne({ _id: id })
        .populate("createdBy", "companyName companyLogo companyWebsite companyDescription")

    if (!job) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not found.");
    }

    if (job.isDeleted) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Cannot update a deleted job");
    }

    if (job.createdBy._id.toString() !== req.user.id.toString()) {
        res.status(httpStatus.UNAUTHORIZED);
        throw new Error("You are not authorized to update this job.");
    }

    const allowFields = [
        "title",
        "description",
        "requirements",
        "responsibilities",
        "location",
        "salary",
        "jobType",
        "experience",
        "positions",
        "applicationDeadline",
        "status"
    ];

    allowFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            job[field] = req.body[field];
        }
    });

    await job.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Job updated successfully",
        job
    });
});


// get recruiter's jobs
const getRecruiterJobs = asyncHandler(async (req, res) => {

    const { search = "", page = 1, limit = 10 } = req.query;

    const recruiterId = req.user.id;

    const skip = (page - 1) * limit;

    const filter = {}

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const jobs = await jobModel
        .find({
            createdBy: recruiterId,
            ...filter
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name email companyName companyLogo");

    const totalJobs = await jobModel.countDocuments({ createdBy: recruiterId });

    const jobWithCounts = await Promise.all(
        jobs.map(async (job) => {
            const applicantsCount = await applicationModel.countDocuments({ job: job._id });

            return {
                ...job.toObject(),
                applicants: applicantsCount
            };
        })
    );

    res.status(httpStatus.OK).json({
        success: true,
        totalJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        jobs: jobWithCounts,
    });

});

// save job
const saveJobs = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const { jobId } = req.params;

    const job = await jobModel.findOne({ _id: jobId, isDeleted: false });

    if (!job) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not found or deleted");
    }

    const user = await userModel.findById(userId);

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
        await user.save();
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: "Job saved successfully.",
        savedJobs: user.savedJobs
    });
});


// unsave job
const unsaveJobs = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId
    );

    await user.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Job removed from saved",
        savedJobs: user.savedJobs
    });
});


// get savedjobs
const getSavedJobs = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { search = "", page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const user = await userModel.findById(userId);

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    const filter = {
        _id: { $in: user.savedJobs },
        isDeleted: false
    };

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
        ];
    }

    const savedJobs = await jobModel
        .find(filter)
        .populate("createdBy", "companyName companyLogo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalSavedJobs = await jobModel.countDocuments(filter);

    res.status(httpStatus.OK).json({
        success: true,
        savedJobs,
        totalSavedJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalSavedJobs / Number(limit)),
    });
});

export { createJob, getAllJobs, getJobDetails, updateJob, getRecruiterJobs, saveJobs, unsaveJobs, getSavedJobs };    