import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully",
            )
        )

})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: fullName,
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

export {
    getUser,
    changeCurrentPassword,
    updateUserProfile,
    getUserByClub
}