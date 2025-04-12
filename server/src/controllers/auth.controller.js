import { userLoginValidator, userRegistrationValidator } from "../validations/authValidator.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


// Options
const options = {
    httpOnly: true,
    secure: true,
}


// Generate access token and refresh token
const generateAccessTokenRefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token and refresh token");
    }
}


// User registration
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const validationErrors = userRegistrationValidator(req.body);

    // Check the user is exist or not
    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while registering user");
    }

    res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User registered successfully"
            )
        )
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    userLoginValidator(req.body);

    // Check the user is exist or not
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User does not exist with this email");
    }

    // Match the password with the hashed password

    const isPasswordMatch = await user.isPasswordCorrect(password);

    if (!isPasswordMatch) {
        throw new ApiError(400, "You have entered wrong Password")
    }

    // Generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessTokenRefreshtoken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Send the response
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {user: loggedInUser, accessToken, refreshToken},
                "User loggedIn successfully"
            )
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
})


// Refresh token when access token is expired
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    console.log(incommingRefreshToken);
    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unathorized request")
    }

    try {
        const decodedToken = jwt.sign(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, newRefreshToken } = await generateAccessTokenRefreshtoken(user._id);
        
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken
}