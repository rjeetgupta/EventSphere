import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiLimiter, loginLimiter, registerLimiter } from './middlewares/rateLimiter.middleware.js';
import { ApiError } from './utils/ApiError.js';
import { asyncHandler } from './utils/asyncHandler.js';

// Import routes
import adminRoute from './routes/admin.route.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import eventRoute from './routes/event.route.js';
import clubRoutes from './routes/club.route.js';
import clubMemberRoutes from './routes/clubMember.route.js';
import clubResourceRoutes from './routes/clubResource.route.js';
import clubAchievementRoutes from './routes/clubAchievement.route.js';
import dashboardRouter from './routes/dashboard.route.js';

const app = express();

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public"));
app.use(cookieParser());

app.set('trust proxy', 1);

// Rate limiting
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/events', eventRoute);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/club-members', clubMemberRoutes);
app.use('/api/v1/club-resources', clubResourceRoutes);
app.use('/api/v1/club-achievements', clubAchievementRoutes);
app.use('/api/v1/dashboard', dashboardRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

export default app;