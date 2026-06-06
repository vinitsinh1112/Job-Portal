import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);

// router.patch("/profile", authMiddleware, updateUserProfile);

router.patch("/update-profile", authMiddleware, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
]), updateUserProfile
);


export default router;
