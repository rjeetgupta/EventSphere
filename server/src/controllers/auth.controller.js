import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';
import Department from '../models/department.model.js';
import mongoose from 'mongoose';

// Options for cookies
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// Generate access token and refresh token with rotation
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

// // Create super admin (one-time setup)
// const createSuperAdmin = asyncHandler(async (req, res) => {
//     try {
//         // Check if super admin already exists
//         const existingSuperAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
//         if (existingSuperAdmin) {
//             throw new ApiError(403, "Super admin already exists");
//         }

//         // Check if email already exists
//         const existingUser = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
//         if (existingUser) {
//             throw new ApiError(409, "User with this email already exists");
//         }

//         // Create super admin
//         const superAdmin = await User.create({
//             name: process.env.SUPER_ADMIN_NAME,
//             email: process.env.SUPER_ADMIN_EMAIL,
//             password: process.env.SUPER_ADMIN_PASSWORD,
//             role: ROLES.SUPER_ADMIN,
//             department: process.env.SUPER_ADMIN_DEPARTMENT
//         });

//         return res
//             .status(201)
//             .json(
//                 new ApiResponse(
//                     201,
//                     {
//                         name: superAdmin.name,
//                         email: superAdmin.email,
//                         role: superAdmin.role
//                     },
//                     "Super admin created successfully"
//                 )
//             );
//     } catch (error) {
//         // Handle specific MongoDB errors
//         if (error.code === 11000) {
//             throw new ApiError(409, "User with this email already exists");
//         }
//         throw error;
//     }
// });

// // Create admin (super admin only)
// const createAdmin = asyncHandler(async (req, res) => {
//     const { name, email, password, departmentName } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         throw new ApiError(409, "User with this email already exists");
//     }

//     // Create admin
//     const admin = await User.create({
//         name,
//         email,
//         password,
//         role: ROLES.ADMIN,
//         departmentName,
//         createdBy: req.user._id
//     });

//     return res
//         .status(201)
//         .json(
//             new ApiResponse(
//                 201,
//                 {
//                     admin: {
//                         _id: admin._id,
//                         name: admin.name,
//                         email: admin.email,
//                         role: admin.role,
//                         username: admin.username,
//                         department: department.name
//                     }
//                 },
//                 "Admin created successfully"
//             )
//         );
// });

// Register user with enhanced security
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, departmentName, studentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Check if studentId is already taken
    if (studentId) {
        const existingStudentId = await User.findOne({ studentId });
        if (existingStudentId) {
            throw new ApiError(409, "This roll number is already registered");
        }
    }

    // Public registration always creates a student
    const user = await User.create({
        name,
        email,
        password,
        studentId,
        role: ROLES.STUDENT,
        departmentName
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        department: user.departmentName,
                        studentId: user.studentId
                    },
                },
                "User registered successfully"
            )
        );
});

// Login user with enhanced security
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        department: user.department
                    },
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find user and update refreshToken to undefined
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Clear cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (!user.refreshToken || incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateTokens(user._id);

        // Update user's refresh token in database
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: refreshToken
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    generateTokens
};