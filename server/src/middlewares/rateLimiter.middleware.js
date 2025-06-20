import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

// Login rate limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes',
    handler: (req, res) => {
        throw new ApiError(429, 'Too many login attempts, please try again after 15 minutes');
    }
});

// Registration rate limiter
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many registration attempts, please try again after 1 hour',
    handler: (req, res) => {
        throw new ApiError(429, 'Too many registration attempts, please try again after 1 hour');
    }
});

// API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res) => {
        throw new ApiError(429, 'Too many requests from this IP, please try again after 15 minutes');
    }
}); 