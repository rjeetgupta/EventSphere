import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters long"],
        },
        date: {
            type: Date,
            required: [true, "Event date is required"],
            validate: {
                validator: function (value) {
                    return value > new Date();
                },
                message: "Event date must be in the future",
            },
        },
        time: {
            type: String,
            required: [true, "Event time is required"],
            match: [
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                "Please enter a valid time in HH:MM format",
            ],
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },
        Image: {
            type: String,
            required: function() { return this.isNew; }
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be at least 1"],
            max: [1000, "Capacity cannot exceed 1000"],
        },
        registrationDeadline: {
            type: Date,
            required: [true, "Registration deadline is required"],
            validate: {
                validator: function (value) {
                    return value < this.date;
                },
                message: "Registration deadline must be before the event date",
            },
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["technical", "cultural", "sports", "other"],
        },
        imageUrl: {
            type: String,
            default: "default-event.jpg",
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: [true, "Club is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        registeredUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ club: 1 });
eventSchema.index({ registeredUsers: 1 });

// Virtual for checking if event is full
eventSchema.virtual("isFull").get(function () {
    return this.registeredUsers.length >= this.capacity;
});

// Virtual for checking remaining spots
eventSchema.virtual("remainingSpots").get(function () {
    return Math.max(0, this.capacity - this.registeredUsers.length);
});

// Method to check if registration is open
eventSchema.methods.isRegistrationOpen = function () {
    const now = new Date();
    return now < this.registrationDeadline && this.status === "upcoming";
};

// Method to check if user is registered
eventSchema.methods.isUserRegistered = function (userId) {
    return this.registeredUsers.some(
        (id) => id.toString() === userId.toString()
    );
};

// Method to update event status
eventSchema.methods.updateStatus = function () {
    const now = new Date();
    if (this.status === "upcoming" && now >= this.date) {
        this.status = "ongoing";
    } else if (
        this.status === "ongoing" &&
        now > new Date(this.date.getTime() + 24 * 60 * 60 * 1000)
    ) {
        this.status = "completed";
    }
    return this.save();
};

const Event = mongoose.model("Event", eventSchema);

export default Event;
