import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { createJob, getAllJobs, getJobDetails, getRecruiterJobs, getSavedJobs, saveJobs, unsaveJobs, updateJob } from '../controllers/jobController.js';

const router = express.Router();

// recruiter routes
router.get("/recruiter-jobs", authMiddleware, roleMiddleware("recruiter"), getRecruiterJobs);       // specific route first
router.post("/create", authMiddleware, roleMiddleware("recruiter"), createJob);                     // create job
router.patch("/:id", authMiddleware, roleMiddleware("recruiter"), updateJob);                       // update job

// user routes
router.get("/", getAllJobs);                                                                        // get all jobs for users
router.get("/saved-jobs", authMiddleware, getSavedJobs);
router.post("/save-job/:jobId", authMiddleware, saveJobs);
router.delete("/save-job/:jobId", authMiddleware, unsaveJobs);
router.get("/:id", authMiddleware, getJobDetails);                                                                  // get single job by id at the very end

export default router;