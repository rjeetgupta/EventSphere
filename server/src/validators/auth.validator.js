import { body } from 'express-validator';
import { ROLES } from '../middlewares/checkRole.middleware.js';



// Role-specific validation rules
const roleSpecificRules = {
    student: [
        body('studentId')
            .trim()
            .notEmpty()
            .withMessage('Student ID is required'),
        body('year')
            .notEmpty()
            .withMessage('Year is required')
            .isInt({ min: 1, max: 4 })
            .withMessage('Year must be between 1 and 4')
    ],
    admin: [
        body('position')
            .trim()
            .notEmpty()
            .withMessage('Position is required')
    ],
    club: [
        body('clubName')
            .trim()
            .notEmpty()
            .withMessage('Club name is required'),
        body('clubDescription')
            .trim()
            .notEmpty()
            .withMessage('Club description is required'),
        body('clubType')
            .trim()
            .notEmpty()
            .withMessage('Club type is required')
            .isIn(['technical', 'cultural', 'sports', 'other'])
            .withMessage('Invalid club type'),
        body('clubWebsite')
            .trim()
            .notEmpty()
            .withMessage('Club website is required')
            .isURL()
            .withMessage('Please enter a valid URL'),
        body('clubSocialLinks')
            .optional()
            .isObject()
            .withMessage('Club social links must be an object')
    ],
    superadmin: [] // No additional fields required for superadmin
};

// Registration validator
export const registerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    
    body('departmentName')
        .trim()
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Department name must be between 2 and 50 characters'),
    
    body('studentId')
        .trim()
        .notEmpty()
        .withMessage('Roll number is required')
        .isLength({ min: 5, max: 20 })
        .withMessage('Roll number must be between 5 and 20 characters')
        .matches(/^[A-Za-z0-9-]+$/)
        .withMessage('Roll number can only contain letters, numbers and hyphens')
];

// Login validator
export const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];

// Create admin validator
export const createAdminValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    
    body('departmentName')
        .trim()
        .notEmpty()
        .withMessage('Department name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Department name must be between 2 and 50 characters')
]; 