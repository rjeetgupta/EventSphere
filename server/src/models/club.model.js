import mongoose, { Schema, model } from "mongoose";

const clubSchema = new Schema({

    clubName: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: ""
    }

}, { timestamps: true });

const Club = model("Club", clubSchema);

export default Club;