import asyncHandler from "express-async-handler";
import jobModel from "../models/jobModel.js";
import httpStatus from "http-status"
import applicationModel from "../models/applicationModel.js";
import fs from 'fs/promises';
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import userModel from "../models/userModel.js";


// apply to a job
const applyJob = asyncHandler(async (req, res) => {
    // get job id which user apply
    const { jobId } = req.params;

    // get user id from token
    const userId = req.user.id;

    // check if job exists 
    const job = await jobModel.findById(jobId);

    if (!job) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not exists");
    }

    if (job.isDeleted) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("This job has been deleted");
    }

    if (job.status !== "open") {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Job is no longer accepting applications");
    }

    // check for duplicate application
    const alreadyApplied = await applicationModel.findOne({
        user: userId,
        job: jobId,
    });

    if (alreadyApplied) {
        res.status(httpStatus.CONFLICT);
        throw new Error("You already appplied for this job");
    }


    // get resume for application
    let resumeUrl;
    let resumeName;

    if (req.file) {
        resumeUrl = await uploadToCloudinary(req.file.path, "Job-portal/resumes");
        resumeName = req.file.originalName;
        await fs.unlink(req.file.path);

    } else {
        const user = await userModel.findById(userId);

        if (!user?.resume) {
            res.status(httpStatus.BAD_REQUEST);
            throw new Error("Please upload a resume or add to profile")
        }
        resumeUrl = user.resume;
        resumeName = "profile-resume.pdf";
    }

    const application = await applicationModel.create({
        user: userId,
        job: jobId,
        resume: resumeUrl,
        resumeName
    });

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "Job applied successfully",
        application
    });

});


// get applications for user
const getMyApplication = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    let jobFilter = {};

    // 🔍 SEARCH LOGIC (job-level filtering)
    if (search) {
        jobFilter = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ],
        };
    }

    // Step 1: find matching jobs (for search)
    const matchingJobs = await jobModel.find(jobFilter).select("_id");

    const jobIds = matchingJobs.map((job) => job._id);

    // Step 2: build application filter
    const applicationFilter = {
        user: userId,
    };

    if (search) {
        applicationFilter.job = { $in: jobIds };
    }

    // get applications
    const applications = await applicationModel
        .find(applicationFilter)
        .populate({
            path: "job",
            select: "title location salary jobType status isDeleted createdBy",
            populate: {
                path: "createdBy",
                select: "companyName",
            },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalApplications = await applicationModel.countDocuments(applicationFilter);

    const formattedApplications = applications.map(app => {
        const appObj = app.toObject();

        if (appObj.job?.isDeleted) {
            appObj.job.status = "deleted";
        }

        return appObj;
    });

    res.status(httpStatus.OK).json({
        success: true,
        totalApplications,
        currentPage: Number(page),
        totalPages: Math.ceil(totalApplications / limit),
        count: applications.length,
        applications: formattedApplications,
    });
});


//get applications for recruiter
const getJobApplications = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;

    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // check if job exists
    const job = await jobModel.findById(jobId);

    if (!job) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Job not found");
    }

    if (job.isDeleted) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("This job has been deleted");
    }

    // ownership check
    if (job.createdBy.toString() !== req.user.id) {
        res.status(httpStatus.FORBIDDEN);
        throw new Error("You can only see your own job's applications");
    }

    // ALWAYS filter by current job
    let filter = {
        job: jobId
    };

    if (search) {
        const regex = new RegExp(search, "i");

        const users = await userModel.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        }).select("_id");

        const userIds = users.map(user => user._id);

        filter.user = { $in: userIds };
    }

    const applications = await applicationModel
        .find(filter)
        .populate("user", "name email bio profileImage skills education resume")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalApplications = await applicationModel.countDocuments(filter);

    res.status(httpStatus.OK).json({
        success: true,
        totalApplications,
        currentPage: Number(page),
        totalPages: Math.ceil(totalApplications / limit),
        count: applications.length,
        applications,
    });
});



// update applications 
const updateApplication = asyncHandler(async (req, res) => {

    // get application id & status 
    const { applicationId } = req.params;
    const { status } = req.body;

    // check application exists
    const application = await applicationModel.findById(applicationId);

    if (!application) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("Application not found");
    }

    // check that recruiter only update their own applications
    const job = await jobModel.findById(application.job);

    if (job.createdBy.toString() !== req.user.id) {
        res.status(httpStatus.FORBIDDEN);
        throw new Error("You can update only your own job's applications");
    }

    // allowed statuses
    const allowedStatus = ["Pending", "Reviewed", "Interview", "Hired", "Rejected"];

    if (!allowedStatus.includes(status)) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Invalid status");
    }

    application.status = status;

    await application.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Application updated succesfully",
        application
    });

});


export { applyJob, getMyApplication, getJobApplications, updateApplication };