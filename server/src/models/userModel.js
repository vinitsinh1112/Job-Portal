import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        // trim: true,
        select: false,
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, "Please use a valid 10-digit phone number"],
    },
    role: {
        type: String,
        enum: ["user", "recruiter", "admin"],
        default: "user",
    },
    profileImage: {
        type: String,
        default: "",
        match: [/^https?:\/\/.+/, "Please use a valid URL"],
    },
    bio: {
        type: String,
        default: "",
    },
    education: {
        type: [
            {
                qualification: {
                    type: String,
                    required: true,
                    trim: true
                },
                institute: {
                    type: String,
                    required: true,
                    trim: true
                },
                yearOfCompletion: {
                    type: Number,
                    min: 1970,
                    max: new Date().getFullYear(),
                },
                score: {
                    type: String,
                    trim: true,
                }
            }
        ],
        default: [],
    },
    languages: {
        type: [String],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    internships: {
        type: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
                companyName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                startDate: {
                    type: Date,
                    required: true
                },
                endDate: {
                    type: Date, // null = ongoing
                    default: null,
                    validate: {
                        validator: function (value) {
                            return !value || value >= this.startDate;
                        },
                        message: "End date must be greater than start date"
                    }
                },
                description: {
                    type: String,
                    trim: true,
                },
                skills: {
                    type: [String],
                    default: [],
                },
                projectName: {
                    type: String,
                    trim: true
                },
                projectUrl: {
                    type: String,
                    default: "",
                    match: [/^https?:\/\/.+/, "Please use a valid URL"],
                }
            }
        ],
        default: [],
    },
    projects: {
        type: [
            {
                projectName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                startDate: {
                    type: Date,
                    required: true
                },
                endDate: {
                    type: Date, // null = ongoing
                    default: null,
                    validate: {
                        validator: function (value) {
                            return !value || value >= this.startDate;
                        },
                        message: "End date must be greater than start date"
                    }
                },
                description: {
                    type: String,
                    trim: true,
                },
                skills: {
                    type: [String],
                    default: [],
                },
                projectUrl: {
                    type: String,
                    default: "",
                    match: [/^https?:\/\/.+/, "Please use a valid URL"],
                }
            }
        ],
        default: [],
    },
    competitiveExams: {
        type: [
            {
                examName: {
                    type: String,
                    required: true,
                    trim: true
                },
                score: {
                    type: String,
                    trim: true
                }
            }
        ],
        default: []
    },
    resume: {
        type: String,
        default: "",
        match: [/^https?:\/\/.+/, "Please use a valid URL"],
    },
    resumeName: {
        type: String
    },
    companyName: {
        type: String,
        default: "",
    },
    companyLogo: {
        type: String,
        default: "",
    },
    companyWebsite: {
        type: String,
        default: "",
        match: [/^https?:\/\/.+/, "Please use a valid URL"],
    },
    companyDescription: {
        type: String,
        default: "",
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }
    ],
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;