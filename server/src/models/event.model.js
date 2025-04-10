import mongoose, { Schema, model } from "mongoose";

const eventSchema = new Schema({
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
    location: {
        type: String,
        required: true,
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    maxSeats: {
        type: Number,
        required: true,
        min: 1
    },
    waitlistEnabled: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Event = model("Event", eventSchema);

export default Event;