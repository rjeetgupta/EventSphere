import mongoose from 'mongoose';

const clubAchievementSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['EVENT', 'CONTRIBUTION', 'LEADERSHIP', 'SPECIAL'],
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    badge: {
        type: String,  // URL to badge image
        required: true
    },
    awardedTo: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        awardedAt: {
            type: Date,
            default: Date.now
        },
        awardedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
clubAchievementSchema.index({ club: 1, type: 1 });
clubAchievementSchema.index({ 'awardedTo.user': 1 });

const ClubAchievement = mongoose.model('ClubAchievement', clubAchievementSchema);
export default ClubAchievement; 