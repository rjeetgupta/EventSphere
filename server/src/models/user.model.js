import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLES } from "../middlewares/checkRole.middleware.js";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false
        },

        studentId: {
            type: String,
            unique: true,
            trim: true,
            required: true,
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.STUDENT
        },
        departmentName: {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Department',
            required: function () {
                return this.role === ROLES.STUDENT || this.role === ROLES.CLUB_MANAGER || this.role === ROLES.ADMIN;
            }
        },

        managedClub: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
            required: function () {
                return this.role === ROLES.CLUB_MANAGER;
            }
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: function () {
                return this.role === ROLES.ADMIN;
            }
        },
        refreshToken: {
            type: String,
            select: false
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true,
        discriminatorKey: 'role'
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};




// Add other indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdBy: 1 });


const User = mongoose.model("User", userSchema);
export default User;