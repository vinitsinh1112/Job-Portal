import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        requirements: {
            type: [String],
            default: []
        },
        responsibilities: {
            type: [String],
            default: []
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Remote"],
            required: true
        },
        salary: {
            type: String,
        },
        location: {
            type: String,
        },
        experience: {
            type: [String],
            enum: ["Fresher", "Mid", "Senior", "Junior"],
        },
        positions: {
            type: Number,
            default: 1,
            min: 1
        },
        applicationDeadline: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    }, { timestamps: true }
);

// index for faster job search
jobSchema.index({
    title: "text",
    description: "text",
    location: "text",
    requirements: "text",
});

jobSchema.index({ createdAt: -1 });

const jobModel = mongoose.model("Job", jobSchema);

export default jobModel;