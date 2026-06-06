import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import errorMiddleware from './middleware/errorMiddleware.js';
import notFound from './middleware/notFoundMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js'
import adminRoutes from "./routes/adminRoutes.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();

const client_url = process.env.CLIENT_URL
const admin_url = process.env.ADMIN_URL

//================== Global Middleawares ==================//
app.use(cors({ origin: [client_url, admin_url], credentials: true }))
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use(cookieParser())

// Testing Route
app.get("/", (req, res) => {
    res.send("API is running");
});

//================== Middleware ==================//
app.use(notFound);
app.use(errorMiddleware);

export default app;