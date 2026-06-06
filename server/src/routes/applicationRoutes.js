import express from "express";
import { applyJob, getJobApplications, getMyApplication, updateApplication } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/apply/:jobId", authMiddleware, roleMiddleware("user"), upload.single("resume"), applyJob);        // apply job by user
router.get("/my-applications", authMiddleware, roleMiddleware("user"), getMyApplication);                       // user get applications
router.get("/job/:jobId", authMiddleware, roleMiddleware("recruiter"), getJobApplications);                     // recruiters get applications
router.patch("/status/:applicationId", authMiddleware, roleMiddleware("recruiter"), updateApplication);         // recruiter update applications status


export default router;