import { body } from 'express-validator';

// Common validation rules for events
const commonValidations = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Event title is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Event title must be between 3 and 100 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Event description is required')
        .isLength({ min: 10 })
        .withMessage('Event description must be at least 10 characters long'),
    body('date')
        .notEmpty()
        .withMessage('Event date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    body('time')
        .notEmpty()
        .withMessage('Event time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format (HH:MM)'),
    body('venue')
        .trim()
        .notEmpty()
        .withMessage('Event venue is required'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Event category is required')
        .isIn(['technical', 'cultural', 'sports', 'other'])
        .withMessage('Invalid event category'),
    body('maxParticipants')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Maximum participants must be a positive number'),
    body('registrationDeadline')
        .optional()
        .isISO8601()
        .withMessage('Invalid registration deadline date format')
];

// Create event validator
export const createEventValidator = [
    ...commonValidations,
    body('clubId')
        .notEmpty()
        .withMessage('Club ID is required')
        .isMongoId()
        .withMessage('Invalid club ID')
];

// Update event validator
export const updateEventValidator = [
    ...commonValidations,
    body('status')
        .optional()
        .isIn(['draft', 'published', 'cancelled', 'completed'])
        .withMessage('Invalid event status')
];

// Event registration validator
export const eventRegistrationValidator = [
    body('eventId')
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Invalid event ID'),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid user ID')
];

// Event feedback validator
export const eventFeedbackValidator = [
    body('eventId')
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Invalid event ID'),
    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Comment must not exceed 500 characters')
]; 