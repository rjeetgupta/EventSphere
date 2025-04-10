import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "organizer", "admin"],
        default: "user"
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: "Club"
    },

}, { timestamps: true })

const User = model("User", userSchema)

export default User