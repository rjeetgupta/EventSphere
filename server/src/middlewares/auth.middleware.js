import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract the token from cookie or body
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access token not found");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // First try to find user
        let user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user not found, try to find admin
        if (!user) {
            user = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        }

        if (!user) {
            throw new ApiError(401, "Invalid Access token");
        }

        req.user = user;
        next(); 

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token");
    }
})