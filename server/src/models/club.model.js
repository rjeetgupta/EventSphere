import mongoose from 'mongoose';
import { ROLES } from '../middlewares/checkRole.middleware.js';

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Club name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Club description is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['technical', 'cultural', 'sports', 'other'],
        required: [true, 'Club type is required']
    },
    departmentName: {
        type: String,
        required: [true, 'Department name is required'],
        enum: ['MBA', 'MCA', 'BCA', 'BBA', 'B.COM', 'B.SC', 'BA']
    },
    imageUrl: {
        type: String, // Cloudinary URL
        required: false,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        validate: {
            validator: async function(managerId) {
                if (!managerId) return true; // Allow null/undefined
                const user = await mongoose.model('User').findById(managerId);
                return user && user.role === ROLES.CLUB_MANAGER;
            },
            message: 'Club manager must be a user with ClubManager role'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClubAchievement'
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
clubSchema.index({ departmentName: 1 });
clubSchema.index({ manager: 1 });
clubSchema.index({ type: 1 });

// Virtual for getting all events of the club
clubSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'club'
});

const Club = mongoose.model('Club', clubSchema);

export default Club; 