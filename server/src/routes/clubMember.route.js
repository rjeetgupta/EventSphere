import { Router } from 'express';
import {
    requestJoinClub,
    handleMembershipRequest,
    getClubMembers,
    updateMemberRole,
    removeMember
} from '../controllers/clubMember.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { ROLES } from '../middlewares/checkRole.middleware.js';

const router = Router();

// Request to join club
router.post('/:clubId/join', verifyJWT, requestJoinClub);

// Get club members (accessible by club members)
router.get('/:clubId/members', verifyJWT, getClubMembers);

// Handle membership request (club manager only)
router.patch('/:memberId/request', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), handleMembershipRequest);

// Update member role (club manager only)
router.patch('/:memberId/role', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), updateMemberRole);

// Remove member (club manager only)
router.delete('/:memberId', verifyJWT, checkRole([ROLES.CLUB_MANAGER]), removeMember);

export default router; 