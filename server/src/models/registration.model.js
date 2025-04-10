import mongoose, { Schema, model } from "mongoose";

const registrationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async function (studentId) {
                const user = await model("User").findById(studentId);
                return user && user.role === "student"; // Ensure registrant is a student
            },
            message: "Only students can register for events"
        }
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["Registered", "Attended", "Cancelled", "Waitlisted"],
        default: "Registered"
    },
    collegeId: {  // Additional student identifier
        type: String,
        required: true
    },
}, { timestamps: true });

const Registration = model("Registration", registrationSchema);

export default Registration;