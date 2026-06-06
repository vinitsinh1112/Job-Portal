import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import httpStatus from "http-status"
import { extractResumeText } from "../utils/resumeParser.js";
import { analyzeResumeWithAI } from "../services/aiService.js";


export const analyzeResume = asyncHandler(async (req, res) => {

    const user = await userModel.findById(req.user.id);

    if (!user.resume) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Please upload a resume");
    }

    const resumeText = await extractResumeText(user.resume);

    const feedback = await analyzeResumeWithAI(resumeText);

    res.status(httpStatus.OK).json({
        success: true,
        feedback
    });
});