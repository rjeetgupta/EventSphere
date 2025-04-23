import mongoose, { Schema, model } from "mongoose";

const clubSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    president: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    membersCount: {
        type: Number,
        default: 0,
    },
    eventsHosted: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "pending", "inactive"],
        default: "pending",
    }

}, { timestamps: true });

const Club = model("Club", clubSchema);

export default Club;