import mongoose from 'mongoose';
import { ROLES } from '../middlewares/checkRole.middleware.js';

const clubMemberSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['CORE_MEMBER', 'GENERAL_MEMBER'],
        default: 'GENERAL_MEMBER'
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    attendance: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'LATE'],
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
clubMemberSchema.index({ club: 1, user: 1 }, { unique: true });
clubMemberSchema.index({ status: 1 });

const ClubMember = mongoose.model('ClubMember', clubMemberSchema);
export default ClubMember; 