import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';

export const authMiddleware = asyncHandler(async (req, res, next) => {

    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(httpStatus.UNAUTHORIZED);
            throw new Error("Not Authorized, token missing.");
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decode.id,
            role: decode.role
        };

        next();

    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED);
        throw new Error("Not authorized, token failed");
    }
});