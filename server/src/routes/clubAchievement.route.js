import { Router } from 'express';
import {
    createAchievement,
    getClubAchievements,
    awardAchievement,
    updateAchievement,
    deleteAchievement
} from '../controllers/clubAchievement.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';

const router = Router();

// Create achievement (club manager only)
router.post('/:clubId/achievements', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), createAchievement);

// Get club achievements (accessible by club members)
router.get('/:clubId/achievements', verifyJWT, getClubAchievements);

// Award achievement to member (club manager only)
router.post('/achievements/:achievementId/award', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), awardAchievement);

// Update achievement (club manager only)
router.patch('/achievements/:achievementId', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), updateAchievement);

// Delete achievement (club manager only)
router.delete('/achievements/:achievementId', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), deleteAchievement);

export default router; 