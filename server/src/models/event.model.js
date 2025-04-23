import mongoose, { Schema, model } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        descrption: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        venue: {
            type: String,
            required: true,
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        organizer: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            name: String,
            type: {
                type: String,
                enum: ["admin", "club"],
                required: true,
            },
        },
        maxParticipants: {
            type: Number,
            required: true,
        },
        currentParticipants: {
            type: Number,
            default: 0,
        },
        image: {
            type: String
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        tags: [String],
        attendees: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                name: String,
                email: String,
                attended: {
                    type: Boolean,
                    default: false,
                },
                registrationDate: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Event = model("Event", eventSchema);

export default Event;
