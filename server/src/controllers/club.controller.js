import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Club from '../models/club.model.js';
import User from '../models/user.model.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a new club
const createClub = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        type,
        departmentName
    } = req.body;

    // taking image
    const clubImage = req.file?.path;
    if(!clubImage){
        throw new ApiError(400, "Club Image is required");
    }

    // upload on cloudinary 
    const image = await uploadOnCloudinary(clubImage)

    if (!image?.url) {
        throw new ApiError(500, "Failed to upload image, please try again.");
    }

    // Check if club already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
        throw new ApiError(409, "Club with this name already exists");
    }

    // Check departmentName permissions
    if (req.user.role === ROLES.ADMIN) {
        // Admin can only create clubs for their departmentName
        if (departmentName !== req.user.departmentName) {
            throw new ApiError(403, "You can only create clubs for your departmentName");
        }
    } else if (req.user.role === ROLES.SUPER_ADMIN) {
        // Super admin can create clubs for any departmentName
        // No additional checks needed
    }

    // Create club without manager initially
    const club = await Club.create({
        name,
        description,
        type,
        departmentName,
        imageUrl: image.url,
    });

    console.log('Created club:', {
        name: club.name,
        imageUrl: club.imageUrl,
        id: club._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                club,
                "Club created successfully"
            )
        );
});

// Get club details
const getClubDetails = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id)
        .populate('manager', 'name email')
        .populate('events');

    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                club,
                "Club details retrieved successfully"
            )
        );
});

// Update club details
const updateClubDetails = asyncHandler(async (req, res) => {
    const club = await Club.findById(req.params.id);

    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    // Check if user is authorized to update the club
    if (req.user.role === ROLES.ADMIN) {
        // Admin can only update clubs in their departmentName
        if (club.departmentName !== req.user.departmentName) {
            throw new ApiError(403, "You can only update clubs in your departmentName");
        }
    } else if (req.user.role === ROLES.SUPER_ADMIN) {
        // Super admin can update any club
        // No additional checks needed
    } else if (req.user.role === ROLES.CLUB_MANAGER) {
        // Club manager can only update their own club
        if (club.manager && club.manager.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You can only update your own club");
        }
    }

    // Update club
    const updatedClub = await Club.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedClub,
                "Club updated successfully"
            )
        );
});

// Get all clubs
const getAllClubs = asyncHandler(async (req, res) => {
    const { type, search, departmentName, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters
    if (type) query.type = type;
    if (departmentName) query.departmentName = departmentName;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // If user is admin, only show clubs from their departmentName
    if (req.user && req.user.role === ROLES.ADMIN) {
        query.departmentName = req.user.departmentName;
    }

    // Get clubs with pagination
    const clubs = await Club.find(query)
        .populate('manager', 'name email')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    // Get total count for pagination
    const total = await Club.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    clubs,
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Clubs retrieved successfully"
            )
        );
});

export {
    createClub,
    getClubDetails,
    updateClubDetails,
    getAllClubs
}; 