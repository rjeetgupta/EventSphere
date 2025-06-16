import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Club from "../models/club.model.js";
import Department from "../models/department.model.js";
import Event from "../models/event.model.js";

// Role constants for consistent usage
export const ROLES = {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    CLUB_MANAGER: 'ClubManager',
    STUDENT: 'Student'
};

// Check if user has required role
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "You don't have permission to perform this action");
        }
        next();
    };
};

// Check if user is admin of the department
export const checkDepartmentAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN) {
        throw new ApiError(403, "Only department admins can perform this action");
    }

    const department = await Department.findOne({ admin: req.user._id });
    if (!department) {
        throw new ApiError(403, "You are not assigned as a department admin");
    }

    req.department = department;
    next();
});

// Check if user is club manager
export const checkClubManager = asyncHandler(async (req, res, next) => {
    if (req.user.role !== ROLES.CLUB_MANAGER) {
        throw new ApiError(403, "Only club managers can perform this action");
    }

    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
        throw new ApiError(403, "You are not assigned as a club manager");
    }

    req.club = club;
    next();
});

// Check if user can manage the event
export const checkEventAccess = asyncHandler(async (req, res, next) => {
    const eventId = req.params.id || req.body.eventId;
    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const event = await Event.findById(eventId).populate('club');
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Super admin can manage all events
    if (req.user.role === ROLES.SUPER_ADMIN) {
        req.event = event;
        return next();
    }

    // Department admin can manage events of their department's clubs
    if (req.user.role === ROLES.ADMIN) {
        const department = await Department.findOne({ admin: req.user._id });
        if (department && event.club.department.toString() === department._id.toString()) {
            req.event = event;
            return next();
        }
    }

    // Club manager can manage events of their club
    if (req.user.role === ROLES.CLUB_MANAGER) {
        const club = await Club.findOne({ manager: req.user._id });
        if (club && event.club._id.toString() === club._id.toString()) {
            req.event = event;
            return next();
        }
    }

    throw new ApiError(403, "You don't have permission to manage this event");
});

// Check if user can register for event
export const checkEventRegistration = asyncHandler(async (req, res, next) => {
    if (req.user.role !== ROLES.STUDENT) {
        throw new ApiError(403, "Only students can register for events");
    }

    const eventId = req.params.id || req.body.eventId;
    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const event = await Event.findById(eventId);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (!event.isRegistrationOpen()) {
        throw new ApiError(400, "Event registration is closed");
    }

    if (event.isFull()) {
        throw new ApiError(400, "Event is full");
    }

    if (event.isUserRegistered(req.user._id)) {
        throw new ApiError(400, "You are already registered for this event");
    }

    req.event = event;
    next();
}); 