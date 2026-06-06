import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResumeWithAI = async (resumeText) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const prompt = `
You are a strict resume reviewer.

Return ONLY in this format:

🚀 Resume Feedback

STRENGTHS:
- 3 to 5 short bullet points

WEAKNESSES:
- 3 to 5 short bullet points

SUGGESTIONS:
- 3 to 5 short bullet points

RULES:
- Keep each bullet MAX 1 line
- No paragraphs
- No explanations
- No extra headings
- No markdown styling
- No "---"
- Keep it concise and recruiter-friendly

Resume:
${resumeText}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return response;

    } catch (error) {
        throw error;
    }
};