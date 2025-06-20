import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true,
        enum: ['MBA', 'MCA', 'BCA', 'BBA', 'B.COM', 'B.SC', 'BA'],
        uppercase: true
    }
}, { timestamps: true });


const Department = mongoose.model('Department', departmentSchema);
export default Department;