import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';

export const roleMiddleware = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(httpStatus.FORBIDDEN).json({
                success: false,
                message: "Access Denied"
            });
        }

        next();
    })
}