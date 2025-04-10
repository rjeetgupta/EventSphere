import mongoose, { Schema, model } from "mongoose";

const gallerySchema = new Schema({

    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    imageUrl: {
        type: String,
        required: true,
    },

    caption: {
        type: String,
        default: ""
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

const Gallery = model("Gallery", gallerySchema);

export default Gallery;