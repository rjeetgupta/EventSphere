import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { ROLES } from "../middlewares/checkRole.middleware.js";

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        startDate,
        endDate,
        venue,
        capacity,
        registrationDeadline,
        category,
        tags,
        imageUrl
    } = req.body;

    // Create event
    const event = await Event.create({
        title,
        description,
        startDate,
        endDate,
        venue,
        capacity,
        registrationDeadline,
        category,
        tags,
        imageUrl,
        organizer: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                event,
                "Event created successfully"
            )
        );
});

// Get all events with filters
const getEvents = asyncHandler(async (req, res) => {
    const {
        category,
        startDate,
        endDate,
        search,
        page = 1,
        limit = 10
    } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Get events with pagination
    const events = await Event.find(query)
        .populate('organizer', 'name email')
        .sort({ startDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    events,
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                "Events retrieved successfully"
            )
        );
});

// Get event by ID
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('registrations.user', 'name email');

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                event,
                "Event retrieved successfully"
            )
        );
});

// Update event
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this event");
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedEvent,
                "Event updated successfully"
            )
        );
});

// Delete event
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this event");
    }

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Event deleted successfully"
            )
        );
});

// Register for event
const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if registration is still open
    if (new Date() > new Date(event.registrationDeadline)) {
        throw new ApiError(400, "Registration deadline has passed");
    }

    // Check if event is full
    if (event.registrations.length >= event.capacity) {
        throw new ApiError(400, "Event is full");
    }

    // Check if user is already registered
    const isRegistered = event.registrations.some(
        reg => reg.user.toString() === req.user._id.toString()
    );

    if (isRegistered) {
        throw new ApiError(400, "Already registered for this event");
    }

    // Add registration
    event.registrations.push({
        user: req.user._id,
        registeredAt: new Date()
    });

    await event.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Successfully registered for event"
            )
        );
});

// Unregister from event
const cancelRegistrationFromEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is registered
    const registrationIndex = event.registrations.findIndex(
        reg => reg.user.toString() === req.user._id.toString()
    );

    if (registrationIndex === -1) {
        throw new ApiError(400, "Not registered for this event");
    }

    // Remove registration
    event.registrations.splice(registrationIndex, 1);
    await event.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Successfully unregistered from event"
            )
        );
});

// Get event registrations (admin only)
const getEventRegistrations = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('registrations.user', 'name email studentId');

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                event.registrations,
                "Event registrations retrieved successfully"
            )
        );
});

// Get event attendance (admin only)
const getEventAttendance = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('registrations.user', 'name email studentId');

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    const attendance = event.registrations.map(reg => ({
        user: reg.user,
        registeredAt: reg.registeredAt,
        attended: reg.attended || false,
        attendedAt: reg.attendedAt
    }));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                attendance,
                "Event attendance retrieved successfully"
            )
        );
});

export {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistrationFromEvent,
    getEventRegistrations,
    getEventAttendance
};
