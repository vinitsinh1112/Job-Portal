import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    resumeName: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Interview", "Hired", "Rejected"],
        default: "Pending",
    }
}, { timestamps: true });


applicationSchema.index(
    { user: 1, job: 1 },
    { unique: true }
);

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;

