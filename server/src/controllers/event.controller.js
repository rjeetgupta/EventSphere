import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Create Event (Admin and Club only)
const createEvent = asyncHandler(async (req, res) => {
    const { name, description, date, time, location, department, status } = req.body;

    if(!name || !description || !date || !time || !location || !department) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const event = await Event.create({
        name,
        description,
        date,
        time,
        location,
        department,
        status: status || "upcoming"
    });

    res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Event created successfully",
                event
            )
        );
});

// Get all events
const getEvents = asyncHandler(async (req, res) => {
    const { department, status, search } = req.query;

    let query = {};
    if(department) {
        query.department = department;
    }
    if(status) {
        query.status = status;
    }

    if(search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const events = await Event.find(query).sort({ date: 1 });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Events fetched successfully",
                events
            )
        );
});


// Get events by ID

const getEventById = asyncHandler(async (req, res) => {

    // Verify the id which is passed in the params correct or not
    const { id } = req.params;

    if(!id) {
        throw new ApiError(400, "Please provide an event ID");
    }

    const event = await Event.findById(id);

    if(!event) {
        throw new ApiError(404, "Event not found");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Event fetched successfully",
                event
            )
        );
});

const getEventDetails = asyncHandler(async (req, res) => {

});


// Update Event (Admin and Club only)
const updateEventDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, date, time, location, department, status } = req.body;

    // Check the given id is valid or not
    if(!id) {
        throw new ApiError(400, "Please provide an event ID");
    }

    const event = await Event.findById(id);

    if(!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is authorized to update
    if (req.user.role !== 'admin' && event.organizer.id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }
      
    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Event updated successfully",
                updatedEvent
            )
        );
});


// Delete Event (Admin and Club only)
const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check the given id is valid or not
    if(!id) {
        throw new ApiError(400, "Please provide an event ID");
    }

    const event = await Event.findById(id);

    if(!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is authorized to delete
    if (req.user.role !== 'admin' && event.organizer.id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(id);

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Event deleted successfully",
                null
            )
        );
});


// Register for the events
const registerForEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check the given id is valid or not
    if(!id) {
        throw new ApiError(400, "Please provide an event ID");
    }

    const event = await Event.findById(id);

    if(!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
        throw new ApiError(400, "Event is full");
    }

    // Check if user is already registered
    // event.attendees.some(attendee => attendee.id.toString() === req.user.userId)
    if (event.registeredUsers.includes(req.user.userId)) {
        throw new ApiError(400, "User already registered for this event");
    }

    event.registeredUsers.push(req.user.userId);
    await event.save();

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Registered for the event successfully",
                null
            )
        );
});


// Cancel registration for the event

const cancelRegistration = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check the given id is valid or not
    if(!id) {
        throw new ApiError(400, "Please provide an event ID");
    }

    const event = await Event.findById(id);

    if(!event) {
        throw new ApiError(404, "Event not found");
    }

    // Check if user is already registered
    if (!event.registeredUsers.includes(req.user.userId)) {
        throw new ApiError(400, "User not registered for this event");
    }

    event.registeredUsers = event.registeredUsers.filter(user => user.toString() !== req.user.userId);
    await event.save();

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Cancelled registration for the event successfully",
                null
            )
        );
});


export {
    createEvent,
    getEvents,
    getEventDetails,
    updateEventDetails,
    deleteEvent,
    getEventById,
    registerForEvent,
    cancelRegistration
}
