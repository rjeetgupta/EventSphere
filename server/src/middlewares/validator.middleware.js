import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
    }
    
    next();
};

// Generic validator middleware
export const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => {
            // If the error is for a conditional field, make the message clearer
            if (err.type === 'field') {
                return `${err.path}: ${err.msg}`;
            }
            return err.msg;
        });
        throw new ApiError(400, errorMessages.join(", "));
    }
    next();
};
