import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ClubMember from '../models/clubMember.model.js';
import Club from '../models/club.model.js';
import User from '../models/user.model.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';

// Request to join club
const requestJoinClub = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const userId = req.user._id;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    // Check if user is already a member
    const existingMember = await ClubMember.findOne({ club: clubId, user: userId });
    if (existingMember) {
        throw new ApiError(400, "You are already a member or have a pending request");
    }

    // Create membership request
    const member = await ClubMember.create({
        club: clubId,
        user: userId,
        status: 'PENDING'
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                member,
                "Join request submitted successfully"
            )
        );
});

// Approve/Reject membership request
const handleMembershipRequest = asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const { status, role } = req.body;

    const member = await ClubMember.findById(memberId);
    if (!member) {
        throw new ApiError(404, "Membership request not found");
    }

    // Check if user is club manager
    const club = await Club.findById(member.club);
    if (club.manager.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to handle membership requests");
    }

    // Update membership status
    member.status = status;
    if (status === 'APPROVED') {
        member.role = role || 'GENERAL_MEMBER';
        member.approvedBy = req.user._id;
        member.approvedAt = new Date();
    }

    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                member,
                `Membership request ${status.toLowerCase()} successfully`
            )
        );
});

// Get club members
const getClubMembers = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const { status, role, page = 1, limit = 10 } = req.query;

    const query = { club: clubId };
    if (status) query.status = status;
    if (role) query.role = role;

    const members = await ClubMember.find(query)
        .populate('user', 'name email')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await ClubMember.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    members,
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Club members retrieved successfully"
            )
        );
});

// Update member role
const updateMemberRole = asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const { role } = req.body;

    const member = await ClubMember.findById(memberId);
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    // Check if user is club manager
    const club = await Club.findById(member.club);
    if (club.manager.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update member roles");
    }

    member.role = role;
    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                member,
                "Member role updated successfully"
            )
        );
});

// Remove member from club
const removeMember = asyncHandler(async (req, res) => {
    const { memberId } = req.params;

    const member = await ClubMember.findById(memberId);
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    // Check if user is club manager
    const club = await Club.findById(member.club);
    if (club.manager.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to remove members");
    }

    await member.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Member removed successfully"
            )
        );
});

export {
    requestJoinClub,
    handleMembershipRequest,
    getClubMembers,
    updateMemberRole,
    removeMember
}; 