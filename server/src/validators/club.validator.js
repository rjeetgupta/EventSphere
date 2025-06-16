import { body } from 'express-validator';

// Club creation validator
export const createClubValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Club name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Club name must be between 2 and 50 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Club description is required')
        .isLength({ min: 10 })
        .withMessage('Club description must be at least 10 characters long'),
    body('type')
        .trim()
        .notEmpty()
        .withMessage('Club type is required')
        .isIn(['technical', 'cultural', 'sports', 'other'])
        .withMessage('Invalid club type'),
    body('departmentName')
        .trim()
        .notEmpty()
        .withMessage('Department is required')
        .isIn(['MBA', 'MCA', 'BCA', 'BBA', 'B.COM', 'B.SC', 'BA'])
        .withMessage('Invalid department'),
];

// Club update validator
export const updateClubValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Club name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Club description must be at least 10 characters long'),
    body('type')
        .optional()
        .trim()
        .isIn(['technical', 'cultural', 'sports', 'other'])
        .withMessage('Invalid club type'),
    body('departmentName')
        .optional()
        .trim()
        .isIn(['MBA', 'MCA', 'BCA', 'BBA', 'B.COM', 'B.SC', 'BA'])
        .withMessage('Invalid department'),
]; 