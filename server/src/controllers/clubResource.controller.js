import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ClubResource from '../models/clubResource.model.js';
import Club from '../models/club.model.js';
import ClubMember from '../models/clubMember.model.js';

// Create new resource
const createResource = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const { title, description, type, url, accessLevel, tags } = req.body;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    // Check if user is club manager or core member
    const member = await ClubMember.findOne({
        club: clubId,
        user: req.user._id,
        status: 'APPROVED',
        role: { $in: ['CLUB_MANAGER', 'CORE_MEMBER'] }
    });

    if (!member) {
        throw new ApiError(403, "Not authorized to create resources");
    }

    const resource = await ClubResource.create({
        club: clubId,
        title,
        description,
        type,
        url,
        accessLevel,
        tags,
        uploadedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                resource,
                "Resource created successfully"
            )
        );
});

// Get club resources
const getClubResources = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const { type, accessLevel, tag, page = 1, limit = 10 } = req.query;

    const query = { club: clubId, isActive: true };
    if (type) query.type = type;
    if (accessLevel) query.accessLevel = accessLevel;
    if (tag) query.tags = tag;

    // Check user's access level
    const member = await ClubMember.findOne({
        club: clubId,
        user: req.user._id,
        status: 'APPROVED'
    });

    if (!member) {
        query.accessLevel = 'PUBLIC';
    } else if (member.role !== 'CORE_MEMBER') {
        query.accessLevel = { $in: ['PUBLIC', 'MEMBERS_ONLY'] };
    }

    const resources = await ClubResource.find(query)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await ClubResource.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    resources,
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Club resources retrieved successfully"
            )
        );
});

// Update resource
const updateResource = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;
    const { title, description, accessLevel, tags } = req.body;

    const resource = await ClubResource.findById(resourceId);
    if (!resource) {
        throw new ApiError(404, "Resource not found");
    }

    // Check if user is resource uploader or club manager
    const member = await ClubMember.findOne({
        club: resource.club,
        user: req.user._id,
        status: 'APPROVED',
        role: { $in: ['CLUB_MANAGER', 'CORE_MEMBER'] }
    });

    if (!member && resource.uploadedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this resource");
    }

    // Update resource
    Object.assign(resource, {
        title,
        description,
        accessLevel,
        tags
    });

    await resource.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                resource,
                "Resource updated successfully"
            )
        );
});

// Delete resource
const deleteResource = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;

    const resource = await ClubResource.findById(resourceId);
    if (!resource) {
        throw new ApiError(404, "Resource not found");
    }

    // Check if user is resource uploader or club manager
    const member = await ClubMember.findOne({
        club: resource.club,
        user: req.user._id,
        status: 'APPROVED',
        role: { $in: ['CLUB_MANAGER', 'CORE_MEMBER'] }
    });

    if (!member && resource.uploadedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this resource");
    }

    // Soft delete
    resource.isActive = false;
    await resource.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Resource deleted successfully"
            )
        );
});

// Track resource download
const trackDownload = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;

    const resource = await ClubResource.findById(resourceId);
    if (!resource) {
        throw new ApiError(404, "Resource not found");
    }

    // Check user's access level
    const member = await ClubMember.findOne({
        club: resource.club,
        user: req.user._id,
        status: 'APPROVED'
    });

    if (!member && resource.accessLevel !== 'PUBLIC') {
        throw new ApiError(403, "Not authorized to access this resource");
    }

    if (member && member.role !== 'CORE_MEMBER' && resource.accessLevel === 'CORE_MEMBERS_ONLY') {
        throw new ApiError(403, "Not authorized to access this resource");
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { downloads: resource.downloads },
                "Download tracked successfully"
            )
        );
});

export {
    createResource,
    getClubResources,
    updateResource,
    deleteResource,
    trackDownload
}; 