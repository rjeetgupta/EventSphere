import { Router } from 'express';
import { getAdminDashboardStats, getStudentDashboardStats, getClubDashboardStats } from '../controllers/dashboard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole, ROLES } from '../middlewares/checkRole.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/admin').get(checkRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), getAdminDashboardStats);
router.route('/student').get(checkRole([ROLES.STUDENT]), getStudentDashboardStats);
router.route('/club').get(checkRole([ROLES.CLUB_MANAGER]), getClubDashboardStats);

export default router; 