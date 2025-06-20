import mongoose from 'mongoose';

const clubResourceSchema = new mongoose.Schema({
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
        enum: ['DOCUMENT', 'LINK', 'IMAGE', 'VIDEO', 'OTHER'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessLevel: {
        type: String,
        enum: ['PUBLIC', 'MEMBERS_ONLY', 'CORE_MEMBERS_ONLY'],
        default: 'MEMBERS_ONLY'
    },
    tags: [{
        type: String,
        trim: true
    }],
    downloads: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
clubResourceSchema.index({ club: 1, type: 1 });
clubResourceSchema.index({ tags: 1 });

const ClubResource = mongoose.model('ClubResource', clubResourceSchema);
export default ClubResource; 