import { body } from 'express-validator';

export const changePasswordValidator = [
    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]; 

export const updateUserValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),
    
    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    
    body("currentPassword")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Current password is required"),
    
    body("newPassword")
        .optional()
        .trim()
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character")
]; 