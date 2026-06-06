import asyncHandler from "express-async-handler";
import jobModel from "../models/jobModel.js";
import httpStatus from "http-status"
import applicationModel from "../models/applicationModel.js";
import userModel from "../models/userModel.js";


const getDashboardStats = asyncHandler(async (req, res) => {

    let users = await userModel.countDocuments();
    let jobs = await jobModel.countDocuments();
    let applications = await applicationModel.countDocuments();

    res.status(httpStatus.OK).json({
        success: true,
        users,
        jobs,
        applications
    });

});



// USERs LOGIC

// getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, search = "", status, role, sort = "newest" } = req.query;

    const skip = (page - 1) * limit;

    let filter = {};

    // Search by name or email
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    // Status filter
    if (status === "active") {
        filter.isBlocked = false;
    }

    if (status === "blocked") {
        filter.isBlocked = true;
    }

    // Role filter
    if (role) {
        filter.role = role;
    }

    // Sort
    let sortOption = {};

    if (sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const users = await userModel.find(filter)
        .select("-password")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));


    const totalUsers = await userModel.countDocuments(filter);

    res.status(httpStatus.OK).json({
        success: true,
        totalUsers,
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
        users
    });

});


// get user details
const getUserDetails = asyncHandler(async (req, res) => {

    const user = await userModel.findById(req.params.id)
        .select("-password");

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    res.status(httpStatus.OK).json({
        success: true,
        user
    });

});


// update user status 
const updateUserStatus = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    const { isBlocked } = req.body;

    const user = await userModel.findByIdAndUpdate(
        userId,
        { isBlocked },
        { new: true }
    ).select("-password");

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: "User status updated",
        user
    });

});



// JOBS LOGIC

// get all jobs
const getAllJobs = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, search = "", status, sort = "newest" } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};


    // SEARCH FIRST
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } }
        ];
    }


    // Filters
    const cleanStatus = status?.trim()?.toLowerCase();

    if (cleanStatus === "open" || cleanStatus === "closed") {
        filter.status = cleanStatus;
        filter.isDeleted = false;
    }

    // showed deleted jobs
    if (cleanStatus === "deleted") {
        filter.isDeleted = true;
        delete filter.status;
    }

    // sort
    let sortOption = {};

    if (sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const jobs = await jobModel.find(filter)
        .populate("createdBy", "name email companyName")
        .sort(sortOption)
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


// get job details
const getJobDetails = asyncHandler(async (req, res) => {

    const job = await jobModel.findById(req.params.id)
        .populate("createdBy", "name email companyName companyDescription companyWebsite")

    if (!job) {
        res.status(httpStatus.NOT_FOUND)
        throw new Error("Job not found");
    }

    res.status(httpStatus.OK).json({
        success: true,
        job
    });

});


// delete jobs (soft delete)
const deleteJob = asyncHandler(async (req, res) => {

    const job = await jobModel.findById(req.params.id);

    if (!job) {
        res.status(httpStatus.NOT_FOUND)
        throw new Error("Job not found");
    }

    job.isDeleted = true;

    await job.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "job deleted successfully"
    });

});


// restore jobs (soft delete)
const restoreJob = asyncHandler(async (req, res) => {

    const job = await jobModel.findById(req.params.id);

    if (!job) {
        res.status(httpStatus.NOT_FOUND)
        throw new Error("Job not found");
    }

    job.isDeleted = false;

    await job.save();

    res.status(httpStatus.OK).json({
        success: true,
        message: "job restored successfully"
    });

});



// APPLICATIONS LOGIC

// get all applications
const getAllApplications = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const applications = await applicationModel.find()
        .populate("user", "name email companyName")
        .populate({
            path: "job",
            select: "title createdBy",
            populate: {
                path: "createdBy",
                select: "companyName"
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalApplications = await applicationModel.countDocuments();

    res.status(httpStatus.OK).json({
        success: true,
        totalApplications,
        currentPage: Number(page),
        totalPages: Math.ceil(totalApplications / limit),
        applications
    });

});


export { getDashboardStats, getAllUsers, getUserDetails, updateUserStatus, getAllJobs, getJobDetails, deleteJob, restoreJob, getAllApplications };