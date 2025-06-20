import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Club from "../models/club.model.js";

// Generate tokens
const generateTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

// Create super admin (one-time setup)
const createSuperAdmin = asyncHandler(async (req, res) => {
    try {
        // Check if super admin already exists
        const existingSuperAdmin = await Admin.findOne({
            role: ROLES.SUPER_ADMIN,
        });
        if (existingSuperAdmin) {
            throw new ApiError(403, "Super admin already exists");
        }

        // Check if email already exists
        const existingAdmin = await Admin.findOne({
            email: process.env.SUPER_ADMIN_EMAIL,
        });
        if (existingAdmin) {
            throw new ApiError(409, "Admin with this email already exists");
        }

        // Create super admin
        const superAdmin = await Admin.create({
            name: process.env.SUPER_ADMIN_NAME,
            email: process.env.SUPER_ADMIN_EMAIL,
            password: process.env.SUPER_ADMIN_PASSWORD,
            role: ROLES.SUPER_ADMIN,
            department: process.env.SUPER_ADMIN_DEPARTMENT,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    user: {
                        name: superAdmin.name,
                        email: superAdmin.email,
                        role: superAdmin.role,
                    },
                },
                "Super admin created successfully"
            )
        );
    } catch (error) {
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            throw new ApiError(409, "Admin with this email already exists");
        }
        throw error;
    }
});

// Create admin (super admin only)
const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, departmentName } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this email already exists");
    }

    // Create admin
    const admin = await Admin.create({
        name,
        email,
        password,
        role: ROLES.ADMIN,
        departmentName,
        createdBy: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    departmentName: admin.departmentName,
                },
            },
            "Admin created successfully"
        )
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(admin._id);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: admin._id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role,
                        departmentName: admin.departmentName,
                    },
                    accessToken,
                    refreshToken,
                },
                "Admin logged in successfully"
            )
        );
});

// Logout admin
const logoutAdmin = asyncHandler(async (req, res) => {
    const adminId = req.user._id;

    // Find admin and update refreshToken to undefined
    const admin = await Admin.findByIdAndUpdate(
        adminId,
        {
            $unset: { refreshToken: 1 },
        },
        {
            new: true,
        }
    );

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // Clear cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// Assign user as club manager
const assignClubManager = asyncHandler(async (req, res) => {
    const { userId, clubId } = req.body;

    // Check if user exists and has required fields
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user has departmentName (required for club managers)
    if (!user.departmentName) {
        throw new ApiError(
            400,
            "User must have a department assigned before becoming a club manager"
        );
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    // Check if club already has a manager
    if (club.manager) {
        throw new ApiError(400, "Club already has a manager");
    }

    // Check if user is already a manager of another club
    const existingClub = await Club.findOne({ manager: userId });
    if (existingClub) {
        throw new ApiError(400, "User is already a manager of another club");
    }

    // Check if user's department matches club's department
    if (user.departmentName !== club.departmentName) {
        throw new ApiError(
            400,
            "User's department must match the club's department"
        );
    }

    // Update user role to club manager
    user.role = ROLES.CLUB_MANAGER;
    user.managedClub = clubId; // Set the managed club reference
    await user.save();

    // Assign user as club manager
    club.manager = userId;
    await club.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    departmentName: user.departmentName,
                },
                club: {
                    _id: club._id,
                    name: club.name,
                    departmentName: club.departmentName,
                },
            },
            "User assigned as club manager successfully"
        )
    );
});

export {
    createSuperAdmin,
    createAdmin,
    loginAdmin,
    logoutAdmin,
    assignClubManager,
};
