import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";

const getUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User details fetched successfully",
            )
        )
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All password fields are required");
    }

    // Find user and explicitly select password field
    const user = await User.findById(req.user._id).select("+password");
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Current password is incorrect");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    // Update password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        );
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name,
                email: email,
            }
        },
        {
            new: true
        }
    ).select("-password")

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User details updated successfully",
            )
        )
});

const getUserByClub = asyncHandler(async (req, res) => {
    
})

const getUsers = asyncHandler(async (req, res) => {
    const { departmentName, role } = req.query;
    let query = {};
    if (departmentName) {
        query.departmentName = departmentName;
    }
    if (role) {
        query.role = role;
    }
    const users = await User.find(query).select('-password');
    return res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

export {
    getUser,
    changeCurrentPassword,
    updateUserProfile,
    getUserByClub,
    getUsers,
}