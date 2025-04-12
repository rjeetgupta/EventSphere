import { body, param } from 'express-validator';

export const createEventValidator = [
  body('title')
    .trim()
    .isLength({ min: 5 }).withMessage('Title must be 5+ characters'),
  body('date')
    .isISO8601().withMessage('Invalid date format (YYYY-MM-DD)')
    .custom((date) => new Date(date) > new Date())
    .withMessage('Event date must be in the future'),
  body('maxSeats')
    .isInt({ min: 1 }).withMessage('Minimum 1 seat required')
];

export {
    createEventValidator
}