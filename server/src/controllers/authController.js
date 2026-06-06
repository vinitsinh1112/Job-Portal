import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, role } = req.body;

    // vaidation of required fields
    if (!name || !email || !password || !role) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Please fill all the fields");
    }

    // check password length
    if (password.length < 8) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Password must be at least 8 characters long.");
    }

    // check if user already exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
        res.status(httpStatus.CONFLICT);
        throw new Error("User already exists.");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    res.status(httpStatus.CREATED).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});


const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Email and password are required");
    }

    // check user exists
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        res.status(httpStatus.NOT_FOUND);
        throw new Error("User not found");
    }

    if (user.isBlocked) {
        res.status(httpStatus.FORBIDDEN);
        throw new Error("Your account has been blocked by admin");
    }

    // match password
    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(httpStatus.UNAUTHORIZED);
        throw new Error("Wrong email or password")
    }


    // generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(httpStatus.OK).json({
        message: "Login successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    });
});

const logoutUser = asyncHandler(async (req, res) => {

    res.status(httpStatus.OK).json({
        message: "Logout Successfully"
    });
});


const adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(httpStatus.BAD_REQUEST);
        throw new Error("Email and Password is required");
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

        const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            success: true,
            token,
            user: {
                email,
                role: "admin",
            }
        });

    } else {
        res.status(httpStatus.UNAUTHORIZED);
        throw new Error("Invalid credentials");
    }
});


export { registerUser, loginUser, logoutUser, adminLogin };