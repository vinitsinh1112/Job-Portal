import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { deleteJob, getAllApplications, getAllJobs, getAllUsers, getDashboardStats, getJobDetails, getUserDetails, restoreJob, updateUserStatus } from '../controllers/adminController.js';

const router = express.Router();

router.get("/dashboard-stats", authMiddleware, roleMiddleware("admin"), getDashboardStats);

router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, roleMiddleware("admin"), getUserDetails);
router.patch("/users/:id/status", authMiddleware, roleMiddleware("admin"), updateUserStatus);

router.get("/jobs", authMiddleware, roleMiddleware("admin"), getAllJobs);
router.get("/jobs/:id", authMiddleware, roleMiddleware("admin"), getJobDetails);
router.patch("/jobs/:id/delete", authMiddleware, roleMiddleware("admin"), deleteJob);
router.patch("/jobs/:id/restore", authMiddleware, roleMiddleware("admin"), restoreJob);

router.get("/applications", authMiddleware, roleMiddleware("admin"), getAllApplications);


export default router;