import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ClubAchievement from '../models/clubAchievement.model.js';
import Club from '../models/club.model.js';
import ClubMember from '../models/clubMember.model.js';

// Create new achievement
const createAchievement = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const { title, description, type, criteria, badge } = req.body;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
        throw new ApiError(404, "Club not found");
    }

    // Check if user is club manager
    const member = await ClubMember.findOne({
        club: clubId,
        user: req.user._id,
        status: 'APPROVED',
        role: 'CLUB_MANAGER'
    });

    if (!member) {
        throw new ApiError(403, "Not authorized to create achievements");
    }

    const achievement = await ClubAchievement.create({
        club: clubId,
        title,
        description,
        type,
        criteria,
        badge
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                achievement,
                "Achievement created successfully"
            )
        );
});

// Get club achievements
const getClubAchievements = asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const { type, page = 1, limit = 10 } = req.query;

    const query = { club: clubId, isActive: true };
    if (type) query.type = type;

    const achievements = await ClubAchievement.find(query)
        .populate('awardedTo.user', 'name')
        .populate('awardedTo.awardedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await ClubAchievement.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    achievements,
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Club achievements retrieved successfully"
            )
        );
});

// Award achievement to member
const awardAchievement = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;
    const { userId, notes } = req.body;

    const achievement = await ClubAchievement.findById(achievementId);
    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    // Check if user is club manager
    const member = await ClubMember.findOne({
        club: achievement.club,
        user: req.user._id,
        status: 'APPROVED',
        role: 'CLUB_MANAGER'
    });

    if (!member) {
        throw new ApiError(403, "Not authorized to award achievements");
    }

    // Check if target user is a club member
    const targetMember = await ClubMember.findOne({
        club: achievement.club,
        user: userId,
        status: 'APPROVED'
    });

    if (!targetMember) {
        throw new ApiError(400, "Target user is not a club member");
    }

    // Check if achievement already awarded to user
    const alreadyAwarded = achievement.awardedTo.some(
        award => award.user.toString() === userId
    );

    if (alreadyAwarded) {
        throw new ApiError(400, "Achievement already awarded to this user");
    }

    // Add award
    achievement.awardedTo.push({
        user: userId,
        awardDate: new Date(),
        awardedBy: req.user._id,
        notes
    });

    await achievement.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                achievement,
                "Achievement awarded successfully"
            )
        );
});

// Update achievement
const updateAchievement = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;
    const { title, description, criteria, badge } = req.body;

    const achievement = await ClubAchievement.findById(achievementId);
    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    // Check if user is club manager
    const member = await ClubMember.findOne({
        club: achievement.club,
        user: req.user._id,
        status: 'APPROVED',
        role: 'CLUB_MANAGER'
    });

    if (!member) {
        throw new ApiError(403, "Not authorized to update achievements");
    }

    // Update achievement
    Object.assign(achievement, {
        title,
        description,
        criteria,
        badge
    });

    await achievement.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                achievement,
                "Achievement updated successfully"
            )
        );
});

// Delete achievement
const deleteAchievement = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;

    const achievement = await ClubAchievement.findById(achievementId);
    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    // Check if user is club manager
    const member = await ClubMember.findOne({
        club: achievement.club,
        user: req.user._id,
        status: 'APPROVED',
        role: 'CLUB_MANAGER'
    });

    if (!member) {
        throw new ApiError(403, "Not authorized to delete achievements");
    }

    // Soft delete
    achievement.isActive = false;
    await achievement.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Achievement deleted successfully"
            )
        );
});

export {
    createAchievement,
    getClubAchievements,
    awardAchievement,
    updateAchievement,
    deleteAchievement
}; 